"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import axios from "axios";
import { useApi } from "@/hooks/useApi";
import type { Order } from "@/types/orders";
import {
  Check,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  Receipt,
  Tag,
  StickyNote,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

const ORDERS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/orders`;

function statusStyle(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-primary/10 text-primary";
    case "Cancelled":
      return "bg-destructive/10 text-destructive";
    case "Shipped":
    case "Processing":
      return "bg-secondary/10 text-secondary-foreground";
    default:
      return "bg-foreground/5 text-foreground/60";
  }
}

export default function AdminOrderDetailPage() {
  const api = useApi();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      setLoading(true);
      setNotFound(false);
      setError(false);

      try {
        const res = await api.get<Order>(`${ORDERS_API_URL}/${id}`);
        setOrder(res.data);
      } catch (err: any) {
        console.log(err);
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, api]);

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
      </main>
    );
  }

  if (notFound || error) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <BlurText
          text={notFound ? "الطلب غير موجود" : "حدث خطأ ما"}
          delay={100}
          animateBy="words"
          direction="top"
          className="font-nastaliq text-4xl font-normal tracking-tight"
        />
        <p className="max-w-md text-foreground/50">
          {notFound
            ? "لم يتم العثور على هذا الطلب، ربما تم حذفه أو الرابط غير صحيح."
            : "تعذر تحميل بيانات الطلب، حاول مرة أخرى."}
        </p>
        <Button size="lg" link="/dashboard/my-orders">
          العودة لقائمة الطلبات
        </Button>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main dir="rtl" className="w-full px-6 pb-24 pt-28">
      <div className="mx-auto max-w-4xl">
        {/* Back + header */}
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-mono text-2xl font-bold text-foreground/90">
                طلب #{order.id.slice(0, 8)}
              </h1>
              <span className="text-sm text-foreground/50">
                {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle(
                  order.status,
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </motion.div>

        {/* error banners */}

        {statusError && (
          <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            {statusError}
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Items + customer info */}
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.1, ...Animate.transition }}
            className="flex flex-col gap-6"
          >
            {/* Customer info */}
            <div className="rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-semibold text-foreground/90">
                معلومات العميل
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={User} label="الاسم" value={order.customerName} />
                <InfoRow
                  icon={Phone}
                  label="الهاتف"
                  value={order.customerPhone}
                  dirLtr
                />
                <InfoRow
                  icon={Truck}
                  label="طريقة الاستلام"
                  value={
                    order.deliveryMethod === "pickup"
                      ? "استلام من الفرع"
                      : "توصيل للمنزل"
                  }
                />
                {order.deliveryMethod !== "pickup" && (
                  <>
                    <InfoRow
                      icon={MapPin}
                      label="المدينة"
                      value={order.shippingCity}
                    />
                    <InfoRow
                      icon={MapPin}
                      label="العنوان"
                      value={order.shippingAddress}
                    />
                  </>
                )}
                <InfoRow
                  icon={CreditCard}
                  label="طريقة الدفع"
                  value={order.paymentMethod}
                />
                {order.transactionRef && (
                  <InfoRow
                    icon={Receipt}
                    label="رقم العملية"
                    value={order.transactionRef}
                    dirLtr
                  />
                )}
              </div>

              {order.notes && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-border/50 bg-background/40 p-4">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-foreground/40" />
                  <p className="text-sm text-foreground/60">{order.notes}</p>
                </div>
              )}

              {order.instapayReceiptBase64 && (
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-sm font-medium text-foreground/70">
                    إيصال الدفع
                  </span>
                  <img
                    src={order.instapayReceiptBase64}
                    alt="إيصال الدفع"
                    className="max-h-80 w-fit rounded-xl border border-border/50 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-semibold text-foreground/90">
                المنتجات ({order.items.length})
              </h2>
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <Link
                    href={`/products/${item.productId}`}
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/40 p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground/90">
                        {item.productNameAr}
                      </span>
                      <span className="text-xs text-foreground/40">
                        {item.quantity} ×{" "}
                        {item.unitPrice.toLocaleString("ar-EG")} ج.م
                        {item.unitType && ` / ${item.unitType}`}
                      </span>
                      {item.customNote && (
                        <span className="text-xs text-foreground/40">
                          ملاحظة: {item.customNote}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 font-semibold text-primary">
                      {item.totalPrice.toLocaleString("ar-EG")} ج.م
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Order summary */}
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.2, ...Animate.transition }}
            className="flex h-fit flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm"
          >
            <h2 className="font-semibold text-foreground/90">ملخص الطلب</h2>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-foreground/60">
                <span>الإجمالي الفرعي</span>
                <span>{order.subtotal.toLocaleString("ar-EG")} ج.م</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-primary">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    خصم{" "}
                    {order.appliedPromoCode && `(${order.appliedPromoCode})`}
                  </span>
                  <span>
                    - {order.discountAmount.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              )}

              <div className="flex justify-between text-foreground/60">
                <span>رسوم التوصيل</span>
                <span>
                  {order.deliveryFee > 0
                    ? `${order.deliveryFee.toLocaleString("ar-EG")} ج.م`
                    : "مجاني"}
                </span>
              </div>

              <div className="mt-2 flex justify-between border-t border-border/50 pt-3 text-base font-bold text-foreground/90">
                <span>الإجمالي</span>
                <span className="text-primary">
                  {order.total.toLocaleString("ar-EG")} ج.م
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  dirLtr,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  dirLtr?: boolean;
}) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-xs text-foreground/40">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span
        className="text-sm font-medium text-foreground/90"
        dir={dirLtr ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  );
}
