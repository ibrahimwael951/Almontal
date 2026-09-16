"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BlurText from "@/components/ui/BlurText";
import ProductImage from "@/components/products/productImage";
import { useAuth } from "@/context/AuthProvider";
import { useApi } from "@/hooks/useApi";
import { uploadReceipt } from "@/lib/media";
import axios from "axios";
import { getCart, clearCart, CART_UPDATED_EVENT } from "@/lib/cart";
import type { CartItem } from "@/types/cart";
import type { PromoValidationResponse } from "@/types/promo";
import {
  LogIn,
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard,
  Wallet,
  Upload,
  Check,
  ShoppingBag,
  Loader2,
  XCircle,
  Info,
} from "lucide-react";
import { Location } from "@/types/locations";
import Loading from "@/components/ui/Loading";

const LOCATIONS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/locations`;
const ORDERS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/orders`;
const PROMOS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Promos`;

const INSTAPAY_MIN_TOTAL = 5000;

type DeliveryMethod = "delivery" | "pickup";
type PaymentMethod = "cash" | "instapay";
type SubmitStage = "idle" | "uploading-receipt" | "submitting-order";

interface PromoState {
  status: "idle" | "checking" | "valid" | "invalid";
  message: string;
  discountAmount?: number;
  newTotal?: number;
  labelAr?: string;
}

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const api = useApi();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promo, setPromo] = useState<PromoState>({
    status: "idle",
    message: "",
  });
  const [notes, setNotes] = useState("");

  const [submitStage, setSubmitStage] = useState<SubmitStage>("idle");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(true);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [successWasDelivery, setSuccessWasDelivery] = useState(false);

  const promoDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCart(getCart());
    const handleUpdate = () => setCart(getCart());
    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
  }, []);

  useEffect(() => {
    if (!user) return;
    setCustomerName(`${user.firstName} ${user.lastName}`.trim());
    setCustomerPhone(user.phoneNumber ?? "");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchLocations = async () => {
      try {
        const res = await api.get<Location[]>(LOCATIONS_API_URL);
        setLocations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLocations();
  }, [user, api]);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  console.log(subtotal > INSTAPAY_MIN_TOTAL);
  const onlyInstapay = subtotal > INSTAPAY_MIN_TOTAL;
  useEffect(() => {
    if (onlyInstapay && paymentMethod === "cash") {
      setPaymentMethod("instapay");
    }
  }, [onlyInstapay, paymentMethod]);

  // ---------- promo validation ----------
  useEffect(() => {
    if (promoDebounce.current) clearTimeout(promoDebounce.current);

    if (!promoCode.trim()) {
      setPromo({ status: "idle", message: "" });
      return;
    }

    setPromo((p) => ({ ...p, status: "checking" }));

    promoDebounce.current = setTimeout(async () => {
      try {
        const res = await api.post<PromoValidationResponse>(
          `${PROMOS_API_URL}/validate`,
          { code: promoCode, subtotal: subtotal },
        );
        const data = res.data;

        if (data.isValid) {
          setPromo({
            status: "valid",
            message: data.message || `تم تطبيق الخصم بنجاح`,
            discountAmount: data.discountAmount,
            newTotal: data.newTotal,
            labelAr: data.labelAr,
          });
        } else {
          setPromo({
            status: "invalid",
            message: data.message || "هذا الكود غير صالح",
          });
        }
      } catch (err) {
        console.log(err);
        setPromo({ status: "invalid", message: "تعذر التحقق من الكود" });
      }
    }, 600);

    return () => {
      if (promoDebounce.current) clearTimeout(promoDebounce.current);
    };
  }, [promoCode]);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("سلتك فارغة، أضف منتجات أولًا");
      return;
    }

    if (deliveryMethod === "delivery" && (!shippingAddress || !shippingCity)) {
      setError("يرجى إدخال عنوان ومدينة التوصيل");
      return;
    }

    if (deliveryMethod === "pickup" && !pickupLocationId) {
      setError("يرجى اختيار فرع الاستلام");
      return;
    }

    if (paymentMethod === "instapay" && !receiptFile) {
      setError("يرجى رفع صورة إيصال التحويل");
      return;
    }

    try {
      let receiptUrl = "";

      // Step 1: upload the receipt image only now, at submit time
      if (paymentMethod === "instapay" && receiptFile) {
        setSubmitStage("uploading-receipt");
        receiptUrl = await uploadReceipt(api, receiptFile);
      }

      // Step 2: submit the order itself
      setSubmitStage("submitting-order");

      const payload = {
        customerName,
        customerPhone,
        deliveryMethod,
        shippingAddress: deliveryMethod === "delivery" ? shippingAddress : "",
        shippingCity: deliveryMethod === "delivery" ? shippingCity : "",
        pickupLocationId: deliveryMethod === "pickup" ? pickupLocationId : "",
        paymentMethod,
        transactionRef: paymentMethod === "instapay" ? transactionRef : "",
        instapayReceiptBase64: paymentMethod === "instapay" ? receiptUrl : "",
        appliedPromoCode: promo.status === "valid" ? promoCode : "",
        notes,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productNameAr: item.nameAr,
          unitPrice: item.price,
          quantity: item.quantity,
          unitType: item.unitType,
          customNote: "",
        })),
      };

      const res = await api.post(ORDERS_API_URL, payload);

      clearCart();
      setSuccessOrderId(res.data?.id ?? null);
      setSuccessWasDelivery(deliveryMethod === "delivery");
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "تعذر إرسال الطلب، حاول مرة أخرى",
        );
      } else {
        setError("حدث خطأ ما، حاول مرة أخرى");
      }
    } finally {
      setSubmitStage("idle");
    }
  };

  if (authLoading) <Loading />;
  if (!user) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LogIn className="h-9 w-9" />
          </span>

          <div className="flex flex-col gap-2">
            <BlurText
              text="سجل الدخول لإتمام الطلب"
              delay={100}
              animateBy="words"
              direction="top"
              className="font-nastaliq text-4xl font-normal tracking-tight mb-5"
            />
            <p className="max-w-md text-foreground/50">
              يجب تسجيل الدخول أولًا حتى تتمكن من إتمام عملية الشراء
            </p>
          </div>

          <div className="flex gap-3">
            <Button size="lg" link={`/login?redirect=/checkout`}>
              تسجيل الدخول
            </Button>
            <Button size="lg" variant="outline" link="/register">
              إنشاء حساب جديد
            </Button>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-foreground/40">
            <ShieldCheck className="h-3.5 w-3.5" />
            كل ذلك حتى تتمكن من متابعة حالة طلبك
          </p>
        </motion.div>
      </main>
    );
  }

  // ---------- Empty cart ----------
  if (cart.length === 0 && !success) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-5 px-6 text-center"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5 text-foreground/30">
          <ShoppingBag className="h-9 w-9" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground/80">
            سلتك فارغة
          </h2>
          <p className="text-sm text-foreground/50">
            أضف منتجات إلى سلتك أولًا حتى تتمكن من إتمام الطلب
          </p>
        </div>
        <Button size="lg" link="/products">
          تصفح المنتجات
        </Button>
      </main>
    );
  }

  // ---------- Success ----------
  if (success) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-9 w-9" />
          </span>
          <div className="flex flex-col gap-2">
            <BlurText
              text="تم استلام طلبك بنجاح"
              delay={100}
              animateBy="words"
              direction="top"
              className="font-nastaliq text-4xl font-normal tracking-tight mb-5 justify-center"
            />
            <p className="max-w-md text-foreground/50">
              سنقوم بمراجعة طلبك والتواصل معك قريبًا، يمكنك متابعة حالة طلبك من
              حسابك
            </p>
            {successWasDelivery && (
              <p className="mx-auto mt-2 flex max-w-md items-start gap-2 rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-right text-sm text-foreground/60">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                قد تُضاف رسوم توصيل حسب موقعك، سنتواصل معك لإتمام الطلب
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button size="lg" variant="outline" link="/products">
              تصفح المنتجات
            </Button>
            <Button
              size="lg"
              link={successOrderId ? `/dashboard/my-orders/${successOrderId}` : "/dashboard/my-orders"}
            >
              متابعة حالة الطلب
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  const isSubmitting = submitStage !== "idle";
  const submitLabel =
    submitStage === "uploading-receipt"
      ? "جاري رفع الإيصال..."
      : submitStage === "submitting-order"
        ? "جاري إرسال الطلب..."
        : "تأكيد الطلب";

  // ---------- Checkout form ----------
  return (
    <main dir="rtl" className="w-full px-6 pb-24 pt-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
        >
          <BlurText
            text="إتمام الطلب"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-5xl font-normal tracking-tight"
          />
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]"
        >
          {/* Left: form fields */}
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.1, ...Animate.transition }}
            className="flex flex-col gap-6"
          >
            {/* Customer info */}
            <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-foreground/90">
                معلومات التواصل
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="customerName">الاسم الكامل</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="text-right"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="customerPhone">رقم الهاتف</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    dir="ltr"
                    className="text-right"
                  />
                </div>
              </div>
            </section>

            {/* Delivery method */}
            <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-foreground/90">
                طريقة الاستلام
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    deliveryMethod === "delivery"
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/50 hover:bg-background/60"
                  }`}
                >
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">توصيل للمنزل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    deliveryMethod === "pickup"
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/50 hover:bg-background/60"
                  }`}
                >
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">استلام من الفرع</span>
                </button>
              </div>

              {deliveryMethod === "delivery" ? (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="shippingCity">المدينة</Label>
                      <Input
                        id="shippingCity"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        required
                        className="text-right"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="shippingAddress">العنوان بالتفصيل</Label>
                      <Input
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                        className="text-right"
                      />
                    </div>
                  </div>

                  <p className="flex items-start gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2.5 text-xs text-foreground/50">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    قد تُضاف رسوم توصيل حسب موقعك، سنتواصل معك لإتمام الطلب
                  </p>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pickupLocation">اختر الفرع</Label>
                  <select
                    id="pickupLocation"
                    value={pickupLocationId}
                    onChange={(e) => setPickupLocationId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm text-right outline-none"
                  >
                    <option value="">اختر فرعًا</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.nameAr} — {loc.addressAr}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </section>

            {/* Payment method */}
            <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-foreground/90">طريقة الدفع</h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  disabled={onlyInstapay}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "cash"
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/50 hover:bg-background/60"
                  } ${onlyInstapay ? "cursor-not-allowed hover:cursor-not-allowed opacity-40" : ""}`}
                >
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    الدفع عند الاستلام
                  </span>
                  {onlyInstapay && (
                    <span className="text-xs font-medium">
                      لا يسمح بالكاش الا في حاله المبلغ اقل من{" "}
                      {INSTAPAY_MIN_TOTAL.toLocaleString("ar-eg") + "ج"}
                      {""}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("instapay")}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "instapay"
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/50 hover:bg-background/60"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">تحويل InstaPay</span>
                </button>
              </div>

              {onlyInstapay && (
                <p className="text-xs text-foreground/40">
                  الدفع عبر InstaPay متاح فقط للطلبات التي تتجاوز{" "}
                  {INSTAPAY_MIN_TOTAL.toLocaleString("ar-EG")} ج.م
                </p>
              )}

              {paymentMethod === "instapay" && (
                <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-background/40 p-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="transactionRef">رقم العملية</Label>
                    <Input
                      id="transactionRef"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="receipt">صورة إيصال التحويل</Label>
                    <label
                      htmlFor="receipt"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 bg-background/60 px-4 py-6 text-sm text-foreground/50 transition-colors hover:bg-background/80"
                    >
                      <Upload className="h-4 w-4" />
                      {receiptFile?.name || "اضغط لرفع صورة الإيصال"}
                    </label>
                    <input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptChange}
                      className="hidden"
                    />
                    <p className="text-xs text-foreground/40">
                      سيتم رفع الصورة عند تأكيد الطلب
                    </p>
                    {receiptPreview && (
                      <img
                        src={receiptPreview}
                        alt="إيصال الدفع"
                        className="mt-2 max-h-48 w-fit rounded-lg border border-border/50 object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Promo + notes */}
            <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm">
              <div className="flex flex-col gap-2">
                <Label htmlFor="promoCode">كود الخصم (اختياري)</Label>
                <div className="relative">
                  <Input
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="SUMMER25"
                    dir="ltr"
                    className="pl-9 font-mono"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    {promo.status === "checking" && (
                      <Loader2 className="h-4 w-4 animate-spin text-foreground/40" />
                    )}
                    {promo.status === "valid" && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                    {promo.status === "invalid" && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </span>
                </div>

                {promo.status === "valid" && (
                  <p className="flex items-center gap-1.5 text-xs text-primary">
                    <Check className="h-3 w-3" />
                    {promo.message}
                    {typeof promo.discountAmount === "number" &&
                      ` — خصم ${promo.discountAmount.toLocaleString("ar-EG")} ج.م`}
                  </p>
                )}
                {promo.status === "invalid" && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <XCircle className="h-3 w-3" />
                    {promo.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="text-right"
                />
              </div>
            </section>
          </motion.div>

          {/* Right: order summary */}
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.2, ...Animate.transition }}
            className="flex h-fit flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm"
          >
            <h2 className="font-semibold text-foreground/90">ملخص الطلب</h2>

            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-primary/10 to-accent/10">
                    <ProductImage
                      src={item.imageUrl}
                      alt={item.nameAr}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-foreground/90">
                      {item.nameAr}
                    </span>
                    <span className="text-xs text-foreground/40">
                      {item.quantity} × {item.price.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t border-border/50 pt-4 text-sm">
              <div className="flex justify-between text-foreground/60">
                <span>عدد المنتجات</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>الإجمالي الفرعي</span>
                <span>{subtotal.toLocaleString("ar-EG")} ج.م</span>
              </div>

              {promo.status === "valid" &&
                typeof promo.discountAmount === "number" && (
                  <div className="flex justify-between text-primary">
                    <span>خصم ({promoCode})</span>
                    <span>
                      - {promo.discountAmount.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>
                )}

              {promo.status === "valid" &&
              typeof promo.newTotal === "number" ? (
                <div className="mt-1 flex justify-between border-t border-border/50 pt-3 text-base font-bold text-foreground/90">
                  <span>الإجمالي التقديري</span>
                  <span className="text-primary">
                    {promo.newTotal.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              ) : (
                <p className="text-xs text-foreground/40">
                  سيتم احتساب رسوم التوصيل بعد مراجعة الطلب
                </p>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </motion.div>
        </form>
      </div>
    </main>
  );
}
