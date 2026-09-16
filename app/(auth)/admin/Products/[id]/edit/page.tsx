"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import ProductFormFields, {
  type ProductFormValues,
} from "@/components/products/ProductFormFields";
import { createImageEntryFromUrl } from "@/components/products/ImageManager";
import { createVideoEntryFromUrl } from "@/components/products/VideoManager";
import { buildProductFormData } from "@/lib/buildProductFormData";
import { useApi } from "@/hooks/useApi";
import axios from "axios";
import type { Product } from "@/types/products";
import type { Category } from "@/types/categories";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const PRODUCTS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Products`;
const CATEGORIES_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Categories`;

export default function EditProductPage() {
  const api = useApi();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get<Product>(`${PRODUCTS_API_URL}/${id}`),
          api.get<Category[] | { items: Category[] }>(CATEGORIES_API_URL),
        ]);

        const product = productRes.data;
        const catList = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : categoriesRes.data.items;
        setCategories(catList);

        const images = [
          ...(product.imageUrl
            ? [createImageEntryFromUrl(product.imageUrl)]
            : []),
          ...(product.gallery ?? []).map(createImageEntryFromUrl),
        ];

        setForm({
          name: product.name,
          nameAr: product.nameAr,
          price: product.price,
          originalPrice: product.originalPrice,
          unitType: product.unitType,
          surfaceType: product.surfaceType,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          categoryNameAr: product.categoryNameAr,
          material: product.material,
          materialAr: product.materialAr,
          finish: product.finish,
          finishAr: product.finishAr,
          color: product.color,
          colorAr: product.colorAr,
          colorHex: product.colorHex,
          thickness: product.thickness,
          originCountry: product.originCountry,
          originCountryAr: product.originCountryAr,
          images,
          video: product.videoUrl
            ? createVideoEntryFromUrl(product.videoUrl)
            : null,
          badge: product.badge,
          badgeAr: product.badgeAr,
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
          inStock: product.inStock,
          shortDescription: product.shortDescription,
          shortDescriptionAr: product.shortDescriptionAr,
          description: product.description,
          descriptionAr: product.descriptionAr,
          featuresText: product.features?.join("\n") ?? "",
          featuresArText: product.featuresAr?.join("\n") ?? "",
        });
      } catch (err: any) {
        console.log(err);
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("تعذر تحميل بيانات المنتج");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, api]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError("");

    if (form.images.length === 0) {
      setError("يرجى إضافة صورة واحدة على الأقل");
      return;
    }

    setSaving(true);
    try {
      const formData = buildProductFormData(form);
      await api.put(`${PRODUCTS_API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("تم حفظ التعديلات بنجاح", {
        description: `تم تحديث "${form.nameAr}" بنجاح`,
        descriptionClassName:"text-foreground!",
        icon: <CheckCircle2 className="h-4 w-4" />,
      });

      router.push("/admin/Products");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ?? "تعذر حفظ التعديلات، حاول مرة أخرى";
        setError(message);
        toast.error(message);
      } else {
        setError("حدث خطأ ما، حاول مرة أخرى");
        toast.error("حدث خطأ ما، حاول مرة أخرى");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
      </main>
    );
  }

  if (notFound || !form) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-4 text-center"
      >
        <p className="text-foreground/60">المنتج غير موجود</p>
        <Button size="lg" onClick={() => router.push("/admin/Products")}>
          العودة للمنتجات
        </Button>
      </main>
    );
  }

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
            onClick={() => router.push("/admin/Products")}
            className="flex w-fit items-center gap-1 text-sm text-foreground/50 hover:text-foreground/80"
          >
            <ChevronRight className="h-4 w-4" />
            العودة للمنتجات
          </button>

          <BlurText
            text="تعديل المنتج"
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
              onClick={() => router.push("/admin/Products")}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
