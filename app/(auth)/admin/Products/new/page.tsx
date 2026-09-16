"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import ProductFormFields, {
  emptyProductForm,
  type ProductFormValues,
} from "@/components/products/ProductFormFields";
import { buildProductFormData } from "@/lib/buildProductFormData";
import { useApi } from "@/hooks/useApi";
import axios from "axios";
import type { Category } from "@/types/categories";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const PRODUCTS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/products`;
const CATEGORIES_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/categories`;

export default function NewProductPage() {
  const api = useApi();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormValues>(emptyProductForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<Category[] | { items: Category[] }>(
          CATEGORIES_API_URL,
        );
        const list = Array.isArray(res.data) ? res.data : res.data.items;
        setCategories(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, [api]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.images.length === 0) {
      setError("يرجى إضافة صورة واحدة على الأقل");
      return;
    }

    setSaving(true);

    try {
      const formData = buildProductFormData(form);
      await api.post(PRODUCTS_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/admin/Products");
      toast.success("تم انشاء منتج جديد", {
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "تعذر إضافة المنتج، حاول مرة أخرى",
        );
      } else {
        setError("حدث خطأ ما، حاول مرة أخرى");
        toast.error("حدث خطأ ما، حاول مرة أخرى");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main dir="rtl" className="w-full px-6 pb-24 pt-28">
      <div className="mx-auto max-w-3xl">
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
          className="flex flex-col gap-4"
        >
          <button
            onClick={() => router.push("/admin/products")}
            className="flex w-fit items-center gap-1 text-sm text-foreground/50 hover:text-foreground/80"
          >
            <ChevronRight className="h-4 w-4" />
            العودة للمنتجات
          </button>

          <BlurText
            text="إضافة منتج جديد"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-4xl font-normal tracking-tight"
          />
        </motion.div>

        <motion.form
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.1, ...Animate.transition }}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-6"
        >
          <ProductFormFields
            form={form}
            setForm={setForm}
            categories={categories}
          />

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "جاري الإضافة..." : "إضافة المنتج"}
            </Button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
