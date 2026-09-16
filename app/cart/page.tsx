"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import ProductImage from "@/components/products/productImage";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  CART_UPDATED_EVENT,
} from "@/lib/cart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { CartItem } from "@/types/cart";

function unitLabel(unitType: string) {
  switch (unitType) {
    case "per_piece":
      return "للقطعة";
    case "per_meter":
      return "للمتر";
    case "per_sqm":
      return "للمتر المربع";
    case "per_set":
      return "للطقم";
    default:
      return "";
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getCart());
    setLoaded(true);

    const handleUpdate = () => setItems(getCart());
    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    const newQty = item.quantity + delta;
    const updated = updateQuantity(productId, newQty);
    setItems(updated);
  };

  const handleRemove = (productId: string) => {
    const updated = removeFromCart(productId);
    setItems(updated);
  };

  const handleClear = () => {
    clearCart();
    setItems([]);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main dir="rtl" className="w-full px-6 pb-24 pt-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
          className="flex flex-col gap-2"
        >
          <BlurText
            text="سلة المشتريات"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-5xl font-normal tracking-tight mb-4"
          />
          {items.length > 0 && (
            <p className="text-sm text-foreground/50">
              {totalItems} {totalItems === 1 ? "منتج" : "منتجات"} في سلتك
            </p>
          )}
        </motion.div>

        {!loaded && (
          <div className="mt-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
          </div>
        )}

        {/* Empty cart */}
        {loaded && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-16 flex flex-col items-center gap-5 text-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5 text-foreground/30">
              <ShoppingBag className="h-9 w-9" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-foreground/80">
                سلتك فارغة
              </h2>
              <p className="text-sm text-foreground/50">
                لم تقم بإضافة أي منتجات بعد، تصفح منتجاتنا وابدأ التسوق
              </p>
            </div>
            <Button size="lg" link="/products">
              تصفح المنتجات
            </Button>
          </motion.div>
        )}

        {/* Cart content */}
        {loaded && items.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            {/* Items list */}
            <motion.div
              {...opacity}
              animate={{ ...Animate.animateonly }}
              transition={{ delay: 0.1, ...Animate.transition }}
              className="flex flex-col gap-3"
            >
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/40 p-4 backdrop-blur-sm"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                      <ProductImage
                        src={item.imageUrl}
                        alt={item.nameAr}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <span className="font-medium text-foreground/90">
                        {item.nameAr}
                      </span>
                      <span className="text-sm text-foreground/50">
                        {item.price.toLocaleString("ar-EG")} ج.م
                        {unitLabel(item.unitType) &&
                          ` / ${unitLabel(item.unitType)}`}
                      </span>

                      {/* quantity controls */}
                      <div className="mt-1 flex items-center gap-1 rounded-full border border-border/50 bg-background/40 p-1 w-fit">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item.productId, -1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/5"
                          aria-label="إنقاص الكمية"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-foreground/90">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item.productId, 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/5"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-3">
                      <span className="font-semibold text-primary">
                        {(item.price * item.quantity).toLocaleString("ar-EG")}{" "}
                        ج.م
                      </span>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/30 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="إزالة من السلة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={handleClear}
                className="mt-2 w-fit text-sm text-foreground/40 underline-offset-2 hover:text-destructive hover:underline"
              >
                إفراغ السلة
              </button>
            </motion.div>

            {/* Summary */}
            <motion.div
              {...opacity}
              animate={{ ...Animate.animateonly }}
              transition={{ delay: 0.2, ...Animate.transition }}
              className="flex h-fit flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm"
            >
              <h2 className="font-semibold text-foreground/90">ملخص الطلب</h2>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-foreground/60">
                  <span>عدد المنتجات</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between text-foreground/60">
                  <span>الإجمالي الفرعي</span>
                  <span>{subtotal.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <p className="text-xs text-foreground/40">
                  رسوم التوصيل تُحسب عند إتمام الطلب
                </p>

                <div className="mt-2 flex justify-between border-t border-border/50 pt-3 text-base font-bold text-foreground/90">
                  <span>الإجمالي</span>
                  <span className="text-primary">
                    {subtotal.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              </div>

              <Button size="lg" link="/checkout" className="mt-2 gap-2">
                إتمام الطلب
              </Button>

              <Link
                href="/products"
                className="text-center text-sm text-foreground/50 hover:text-foreground/80"
              >
                متابعة التسوق
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
