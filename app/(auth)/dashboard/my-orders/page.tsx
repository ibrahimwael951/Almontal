"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import { useAuth } from "@/context/AuthProvider";
import { useApi } from "@/hooks/useApi";
import type { Order } from "@/types/orders";
import {
  LogIn,
  Package,
  Truck,
  MapPin,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";

const ORDERS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Orders`;

const statusLabels: Record<string, string> = {
  Pending: "قيد الانتظار",
  Confirmed: "تم التأكيد",
  Processing: "قيد التجهيز",
  Shipped: "تم الشحن",
  Delivered: "تم التسليم",
  Cancelled: "ملغي",
};

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

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const api = useApi();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Order[]>(`${ORDERS_API_URL}/my-orders`, {});
      setOrders(res.data);
    } catch (err) {
      console.log(err);
      setError("تعذر تحميل طلباتك، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, fetchOrders]);

  // ---------- Auth loading ----------
  if (authLoading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
      </main>
    );
  }

  // ---------- Not logged in ----------
  if (!user) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="h-9 w-9" />
        </span>
        <div className="flex flex-col gap-2">
          <BlurText
            text="سجل الدخول لمتابعة طلباتك"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-4xl font-normal tracking-tight mb-5"
          />
          <p className="max-w-md text-foreground/50">
            يجب تسجيل الدخول أولًا حتى تتمكن من رؤية طلباتك السابقة ومتابعة
            حالتها
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" link="/login?redirect=/my-orders">
            تسجيل الدخول
          </Button>
          <Button size="lg" variant="outline" link="/register">
            إنشاء حساب جديد
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="w-full px-6 pb-24 pt-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
          className="flex flex-col gap-1"
        >
          <BlurText
            text="طلباتي"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-5xl font-normal tracking-tight mb-10"
          />
          <p className="text-sm text-foreground/50">
            تابع حالة طلباتك السابقة والحالية
          </p>
        </motion.div>

        {error && !loading && (
          <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {loading && (
          <div className="mt-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 text-foreground/30">
              <ShoppingBag className="h-7 w-7" />
            </span>
            <p className="text-foreground/50">لم تقم بأي طلبات بعد</p>
            <Button size="lg" link="/products">
              تصفح المنتجات
            </Button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.1, ...Animate.transition }}
            className="mt-8 flex flex-col gap-3"
          >
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => router.push(`/dashboard/my-orders/${order.id}`)}
                className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/40 p-5 text-right backdrop-blur-sm transition-colors hover:bg-background/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground/90">
                      طلب #{order.id.slice(0, 8)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyle(
                        order.status,
                      )}`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/40">
                    <span className="flex items-center gap-1">
                      {order.deliveryMethod === "pickup" ? (
                        <MapPin className="h-3 w-3" />
                      ) : (
                        <Truck className="h-3 w-3" />
                      )}
                      {order.deliveryMethod === "pickup"
                        ? "استلام من الفرع"
                        : "توصيل"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {order.items.length} منتج
                    </span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-semibold text-primary">
                    {order.total.toLocaleString("ar-EG")} ج.م
                  </span>
                  <ChevronLeft className="h-4 w-4 text-foreground/30" />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
