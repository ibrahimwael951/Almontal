"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import axios from "axios";
import { useApi } from "@/hooks/useApi";
import type { Order } from "@/types/orders";
import {
  Check,
  Package,
  Truck,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PaginatedResponse } from "@/types/PaginatedResponse";

const ORDERS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/orders`;

const statusOptions = [
  { value: "Pending", label: "قيد الانتظار" },
  { value: "Confirmed", label: "تم التأكيد" },
  { value: "Processing", label: "قيد التجهيز" },
  { value: "Shipped", label: "تم الشحن" },
  { value: "Delivered", label: "تم التسليم" },
  { value: "Cancelled", label: "ملغي" },
];

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

function statusLabel(status: string) {
  return statusOptions.find((s) => s.value === status)?.label ?? status;
}

export default function AdminOrdersPage() {
  const api = useApi();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<PaginatedResponse<Order>>(ORDERS_API_URL, {
        params: { pageNumber, pageSize: 15 },
      });
      setOrders(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
      setError("تعذر تحميل الطلبات، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }, [api, pageNumber]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.put(`${ORDERS_API_URL}/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      setSuccess("تم تحديث حالة الطلب بنجاح");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "تعذر تحديث حالة الطلب، حاول مرة أخرى",
        );
      } else {
        setError("حدث خطأ ما، حاول مرة أخرى");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main dir="rtl" className="w-full px-6 pb-24 pt-28">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
          className="flex flex-col gap-1"
        >
          <BlurText
            text="الطلبات"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-4xl font-normal tracking-tight mb-5"
          />
          <p className="text-sm text-foreground/50">
            تابع طلبات العملاء وحدّث حالتها
          </p>
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-medium text-foreground/90">
                {success}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Orders list */}
        {!loading && !error && (
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.15, ...Animate.transition }}
            className="mt-8 flex flex-col gap-3"
          >
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-5 backdrop-blur-sm transition-colors hover:bg-background/60 sm:flex-row sm:items-center"
              >
                {/* Clickable main info */}
                <button
                  onClick={() => router.push(`/admin/Orders/${order.id}`)}
                  className="flex flex-1 flex-col gap-2 text-right"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground/90">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyle(
                        order.status,
                      )}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/60">
                    <span>{order.customerName}</span>
                    <span dir="ltr" className="text-foreground/40">
                      {order.customerPhone}
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
                </button>

                {/* Price + status control */}
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-semibold text-primary">
                    {order.total.toLocaleString("ar-EG")} ج.م
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    disabled={updatingId === order.id}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-xs outline-none disabled:opacity-50"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => router.push(`/admin/Orders/${order.id}`)}
                    aria-label="عرض التفاصيل"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <p className="mt-16 text-center text-foreground/40">
                لا توجد طلبات حاليًا
              </p>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => p - 1)}
              className="gap-1"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <span className="text-sm text-foreground/50">
              صفحة {pageNumber} من {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={pageNumber >= totalPages}
              onClick={() => setPageNumber((p) => p + 1)}
              className="gap-1"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
