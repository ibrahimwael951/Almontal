"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlurText from "@/components/ui/BlurText";
import ProductImage from "@/components/products/productImage";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useApi } from "@/hooks/useApi";
import type { Product } from "@/types/products";
import { Plus, Pencil, Trash2, Check, Search, Star } from "lucide-react";

const PRODUCTS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/products`;

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export default function ManageProductsPage() {
  const api = useApi();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<PaginatedResponse<Product>>(PRODUCTS_API_URL, {
        params: { pageSize: 100 },
      });
      setProducts(res.data.items);
    } catch (err) {
      console.log(err);
      setError("تعذر تحميل المنتجات، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const filtered = products.filter(
    (p) =>
      p.nameAr.includes(search) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`${PRODUCTS_API_URL}/${deleteTarget.id}`);
      setSuccess(`تم حذف "${deleteTarget.nameAr}" بنجاح`);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "تعذر حذف المنتج، حاول مرة أخرى"
        );
      } else {
        setError("حدث خطأ ما، حاول مرة أخرى");
      }
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main dir="rtl" className="w-full px-6 pb-24 pt-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div className="flex flex-col gap-1">
            <BlurText
              text="إدارة المنتجات"
              delay={100}
              animateBy="words"
              direction="top"
              className="font-nastaliq text-4xl font-normal tracking-tight mb-5"
            />
            <p className="text-sm text-foreground/50">
              أضف، عدّل أو احذف منتجاتك
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => router.push("/admin/Products/new")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة منتج جديد
          </Button>
        </motion.div>

        <div className="relative mt-6 max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
          <Input
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 text-right"
          />
        </div>

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

        {!loading && !error && (
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.15, ...Animate.transition }}
            className="mt-8 flex flex-col gap-3"
          >
            {filtered.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/40 p-4 backdrop-blur-sm transition-colors hover:bg-background/60"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-primary/10 to-secondary/10">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.nameAr}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground/90">
                      {product.nameAr}
                    </span>
                    {product.isFeatured && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        مميز
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="flex items-center gap-0.5 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        الأكثر مبيعًا
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-foreground/40">
                    {product.categoryNameAr}
                  </span>
                </div>

                <div className="hidden flex-col items-end sm:flex">
                  <span className="font-semibold text-primary">
                    {product.price.toLocaleString("ar-EG")} ج.م
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-foreground/40 line-through">
                      {product.originalPrice.toLocaleString("ar-EG")} ج.م
                    </span>
                  )}
                </div>

                <span
                  className={`hidden shrink-0 rounded-full px-3 py-1 text-xs sm:block ${
                    product.inStock
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {product.inStock ? "متوفر" : "غير متوفر"}
                </span>

                <div className="flex shrink-0 gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/admin/Products/${product.id}/edit`)
                    }
                    aria-label="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setDeleteTarget(product)}
                    aria-label="حذف"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="mt-16 text-center text-foreground/40">
                {search
                  ? "لا توجد منتجات تطابق بحثك"
                  : "لا توجد منتجات حاليًا، ابدأ بإضافة منتج جديد"}
              </p>
            )}
          </motion.div>
        )}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف "{deleteTarget?.nameAr}" نهائيًا. لا يمكن التراجع عن هذا
              الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "جاري الحذف..." : "حذف نهائيًا"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}