"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import ProductImage from "@/components/products/productImage";
import axios from "axios";
import type { Product } from "@/types/products";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Home,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { addToCart } from "@/lib/cart";

const PRODUCTS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/products`;

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      setError(false);

      try {
        const res = await axios.get<Product>(`${PRODUCTS_API_URL}/${id}`);
        setProduct(res.data);
        setActiveImage(0);
        setQuantity(1);
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

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    addToCart(
      {
        productId: product.id,
        nameAr: product.nameAr,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        unitType: product.unitType,
      },
      quantity,
    );

    setAdded(true);
  };

  // ---------- Loading ----------
  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
          <p className="text-sm text-foreground/50">جاري تحميل المنتج...</p>
        </motion.div>
      </main>
    );
  }

  // ---------- Not found / error ----------
  if (notFound || error) {
    return (
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{ rotate: [0, -6, 6, -6, 0] }}
            transition={{
              duration: 1.2,
              delay: 0.6,
              ease: "easeInOut",
            }}
            className="relative flex h-28 w-28 items-center justify-center rounded-full border border-border/50 bg-background/40 backdrop-blur-sm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.3}
              className="h-14 w-14 text-foreground/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5 12 3l9 4.5M3 7.5v9L12 21m-9-4.5L12 12m0 9 9-4.5v-9M12 12l9-4.5M12 12v9"
              />
            </svg>

            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-sm font-bold text-white shadow-md"
            >
              !
            </motion.span>
          </motion.div>

          <div className="flex flex-col gap-2">
            <BlurText
              text={notFound ? "المنتج غير موجود" : "حدث خطأ ما"}
              delay={100}
              animateBy="words"
              direction="top"
              className="font-nastaliq text-5xl font-normal tracking-tight justify-center mb-5"
            />
            <p className="max-w-md text-foreground/50">
              {notFound
                ? "يبدو أن هذا المنتج غير متوفر أو تم حذفه. تصفح بقية منتجاتنا الرائعة بدلاً منه."
                : "تعذر تحميل بيانات المنتج، تأكد من اتصالك بالإنترنت وحاول مرة أخرى."}
            </p>
          </div>

          <div className="mt-2 flex gap-3">
            <Button size="lg" link="/products">
              تصفح المنتجات
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ChevronRight className="h-4 w-4" />
              رجوع
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  if (!product) return null;

  const gallery =
    product.gallery && product.gallery.length > 0
      ? [product.imageUrl, ...product.gallery]
      : [product.imageUrl];

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const unitLabel =
    product.unitType === "per_piece"
      ? "للقطعة"
      : product.unitType === "per_meter"
        ? "للمتر"
        : product.unitType === "per_sqm"
          ? "للمتر المربع"
          : product.unitType === "per_set"
            ? "للطقم"
            : "";

  return (
    <main className="relative w-full px-6 pb-24 pt-28" dir="rtl">
      {/* Breadcrumb */}
      <motion.div
        {...opacity}
        animate={{ ...Animate.animateonly }}
        transition={{ ...Animate.transition }}
        className="mx-auto flex max-w-6xl items-center gap-2 text-sm text-foreground/40"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 hover:text-foreground/70"
        >
          <Home className="h-3.5 w-3.5" />
          الرئيسية
        </button>
        <ChevronLeft className="h-3.5 w-3.5" />
        <button
          onClick={() => router.push("/products")}
          className="hover:text-foreground/70"
        >
          منتجاتنا
        </button>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-foreground/70">{product.nameAr}</span>
      </motion.div>

      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
        {/* ---------- Gallery ---------- */}
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.1, ...Animate.transition }}
          className="flex flex-col gap-4"
        >
          <div className="relative h-105 w-full overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-primary/40 to-accent/20 dark:from-primary/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="h-full w-full"
              >
                <ProductImage
                  src={gallery[activeImage]}
                  alt={product.nameAr}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {product.badgeAr && (
              <span className="absolute right-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white">
                {product.badgeAr}
              </span>
            )}

            {discountPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-white">
                خصم {discountPercent}%
              </span>
            )}

            {!product.inStock && (
              <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-base font-medium text-foreground/70 backdrop-blur-sm">
                غير متوفر حاليًا
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                    activeImage === i
                      ? "border-primary"
                      : "border-border/50 hover:border-foreground/30"
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt={`${product.nameAr} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ---------- Info ---------- */}
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.2, ...Animate.transition }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <span className="w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/60">
              {product.categoryNameAr}
            </span>

            <h1 className="text-3xl font-bold leading-snug text-foreground/90 sm:text-4xl">
              {product.nameAr}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-foreground/50">
                {product.rating.toFixed(1)} ({product.reviewsCount} تقييم)
              </span>
            </div>

            <p className="leading-relaxed text-foreground/60">
              {product.shortDescriptionAr}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 border-y border-border/50 py-5">
            <span className="text-3xl font-bold text-primary dark:text-primary">
              {product.price.toLocaleString("ar-EG")} ج.م
            </span>
            {product.originalPrice > product.price && (
              <span className="mb-1 text-base text-foreground/40 line-through">
                {product.originalPrice.toLocaleString("ar-EG")} ج.م
              </span>
            )}
            {unitLabel && (
              <span className="mb-1 text-sm text-foreground/40">
                / {unitLabel}
              </span>
            )}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Spec label="الخامة" value={product.materialAr} />
            <Spec label="التشطيب" value={product.finishAr} />
            <Spec
              label="اللون"
              value={product.colorAr}
              swatch={product.colorHex}
            />
            <Spec label="السُمك / المقاس" value={product.thickness} />
            <Spec label="بلد المنشأ" value={product.originCountryAr} />
            <Spec
              label="التوفر"
              value={product.inStock ? "متوفر" : "غير متوفر"}
            />
          </div>

          {/* Features */}
          {product.featuresAr && product.featuresAr.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground/80">المميزات</h3>
              <ul className="flex flex-col gap-2">
                {product.featuresAr.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground/60"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity + CTA */}
          {product.inStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground/70">
                الكمية
              </span>
              <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/40 p-1">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/5 disabled:opacity-30"
                  aria-label="إنقاص الكمية"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-foreground/90">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/5"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {unitLabel && (
                <span className="text-xs text-foreground/40">{unitLabel}</span>
              )}
            </div>
          )}

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className="flex-1 gap-2 py-5"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    تمت الإضافة للسلة
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.inStock ? "أضف إلى السلة" : "غير متوفر حاليًا"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 py-5"
              link="/contact"
            >
              تواصل معنا للاستفسار
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Full description */}
      {product.descriptionAr && (
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.3, ...Animate.transition }}
          className="mx-auto mt-16 max-w-6xl border-t border-border/50 pt-10"
        >
          <h2 className="mb-4 text-2xl font-semibold text-foreground/90">
            تفاصيل المنتج
          </h2>
          <p className="max-w-3xl leading-loose text-foreground/60">
            {product.descriptionAr}
          </p>
        </motion.div>
      )}

      {/* Video */}
      {product.videoUrl && (
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.4, ...Animate.transition }}
          className="mx-auto mt-12 max-w-6xl"
        >
          <h2 className="mb-4 text-2xl font-semibold text-foreground/90">
            فيديو المنتج
          </h2>
          <video
            src={product.videoUrl}
            controls
            className="w-full aspect-video rounded-2xl border border-border/50 bg-primary"
          />
        </motion.div>
      )}
    </main>
  );
}

function Spec({
  label,
  value,
  swatch,
}: {
  label: string;
  value: string;
  swatch?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background/40 p-3">
      <span className="text-xs text-foreground/40">{label}</span>
      <div className="flex items-center gap-2 font-medium text-foreground/80">
        {swatch && (
          <span
            className="h-4 w-4 rounded-full border border-border/50"
            style={{ backgroundColor: swatch }}
          />
        )}
        {value}
      </div>
    </div>
  );
}
