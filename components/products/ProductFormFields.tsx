"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ImageManager, {
  type ImageEntry,
} from "@/components/products/ImageManager";
import VideoManager, {
  type VideoEntry,
} from "@/components/products/VideoManager";
import type { Category } from "@/types/categories";

export interface ProductFormValues {
  name: string;
  nameAr: string;
  price: number;
  originalPrice: number;
  unitType: string;
  surfaceType: string;
  categoryId: string;
  categoryName: string;
  categoryNameAr: string;
  material: string;
  materialAr: string;
  finish: string;
  finishAr: string;
  color: string;
  colorAr: string;
  colorHex: string;
  thickness: string;
  originCountry: string;
  originCountryAr: string;
  images: ImageEntry[];
  video: VideoEntry | null;
  badge: string;
  badgeAr: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  shortDescription: string;
  shortDescriptionAr: string;
  description: string;
  descriptionAr: string;
  featuresText: string;
  featuresArText: string;
}

export const emptyProductForm: ProductFormValues = {
  name: "",
  nameAr: "",
  price: 0,
  originalPrice: 0,
  unitType: "per_piece",
  surfaceType: "accessory",
  categoryId: "",
  categoryName: "",
  categoryNameAr: "",
  material: "",
  materialAr: "",
  finish: "",
  finishAr: "",
  color: "",
  colorAr: "",
  colorHex: "#D4AF37",
  thickness: "",
  originCountry: "",
  originCountryAr: "",
  images: [],
  video: null,
  badge: "",
  badgeAr: "",
  isFeatured: false,
  isBestSeller: false,
  inStock: true,
  shortDescription: "",
  shortDescriptionAr: "",
  description: "",
  descriptionAr: "",
  featuresText: "",
  featuresArText: "",
};

interface ProductFormFieldsProps {
  form: ProductFormValues;
  setForm: (form: ProductFormValues) => void;
  categories: Category[];
}

export default function ProductFormFields({
  form,
  setForm,
  categories,
}: ProductFormFieldsProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    setForm({
      ...form,
      categoryId,
      categoryName: cat?.name ?? "",
      categoryNameAr: cat?.nameAr ?? "",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Basic info */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6">
        <h3 className="text-sm font-semibold text-foreground/70">
          المعلومات الأساسية
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameAr">الاسم بالعربية</Label>
            <Input
              id="nameAr"
              name="nameAr"
              value={form.nameAr}
              onChange={handleChange}
              required
              placeholder="طقم مقابض دواليب مطبخ نحاس"
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">الاسم بالإنجليزية</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Brushed Brass Cabinet Handles"
              dir="ltr"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category">الفئة</Label>
          <select
            id="category"
            value={form.categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            required
            className="w-full rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm text-right outline-none"
          >
            <option value="">اختر فئة</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameAr}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="shortDescriptionAr">وصف مختصر (عربي)</Label>
            <Textarea
              id="shortDescriptionAr"
              name="shortDescriptionAr"
              value={form.shortDescriptionAr}
              onChange={handleChange}
              rows={2}
              placeholder="مقابض نحاس صلب ثقيلة الوزن مع تخريش ألماسي"
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="shortDescription">وصف مختصر (إنجليزي)</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              rows={2}
              placeholder="Heavyweight solid brass knurled handles"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="descriptionAr">الوصف الكامل (عربي)</Label>
            <Textarea
              id="descriptionAr"
              name="descriptionAr"
              value={form.descriptionAr}
              onChange={handleChange}
              rows={4}
              placeholder="تمنح دواليب مطبخك لمسة فندقية راقية ومريحة في الاستخدام اليومي..."
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">الوصف الكامل (إنجليزي)</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Elevate every cabinet door and drawer with jewel-like tactile precision..."
              dir="ltr"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6">
        <h3 className="text-sm font-semibold text-foreground/70">
          السعر والوحدة
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">السعر</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              min={0}
              placeholder="160"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="originalPrice">السعر قبل الخصم</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              value={form.originalPrice}
              onChange={handleChange}
              min={0}
              placeholder="210"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="unitType">نوع الوحدة</Label>
            <select
              id="unitType"
              name="unitType"
              value={form.unitType}
              onChange={handleChange}
              className="w-full rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm text-right outline-none"
            >
              <option value="per_piece">للقطعة</option>
              <option value="per_meter">للمتر</option>
              <option value="per_sqm">للمتر المربع</option>
              <option value="per_set">للطقم</option>
            </select>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6">
        <h3 className="text-sm font-semibold text-foreground/70">المواصفات</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="materialAr">الخامة (عربي)</Label>
            <Input
              id="materialAr"
              name="materialAr"
              value={form.materialAr}
              onChange={handleChange}
              placeholder="نحاس صلب مسبوك مع طلاء ذهبي"
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="material">الخامة (إنجليزي)</Label>
            <Input
              id="material"
              name="material"
              value={form.material}
              onChange={handleChange}
              placeholder="Solid Brass with PVD Finish"
              dir="ltr"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="finishAr">التشطيب (عربي)</Label>
            <Input
              id="finishAr"
              name="finishAr"
              value={form.finishAr}
              onChange={handleChange}
              placeholder="تخريش ماسي مانع للانزلاق"
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="finish">التشطيب (إنجليزي)</Label>
            <Input
              id="finish"
              name="finish"
              value={form.finish}
              onChange={handleChange}
              placeholder="Diamond Cross-Knurled Texture"
              dir="ltr"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="colorAr">اللون (عربي)</Label>
            <Input
              id="colorAr"
              name="colorAr"
              value={form.colorAr}
              onChange={handleChange}
              placeholder="ذهبي نحاسي مطفي دافئ"
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="color">اللون (إنجليزي)</Label>
            <Input
              id="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Warm Satin Brushed Brass"
              dir="ltr"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="colorHex">كود اللون</Label>
            <div className="flex gap-2">
              <Input
                id="colorHex"
                name="colorHex"
                value={form.colorHex}
                onChange={handleChange}
                placeholder="#D4AF37"
                dir="ltr"
                className="flex-1"
              />
              <input
                type="color"
                value={form.colorHex || "#000000"}
                onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-border/50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="thickness">السُمك / المقاس</Label>
            <Input
              id="thickness"
              name="thickness"
              value={form.thickness}
              onChange={handleChange}
              placeholder="160mm Hole Spacing"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="originCountryAr">بلد المنشأ (عربي)</Label>
            <Input
              id="originCountryAr"
              name="originCountryAr"
              value={form.originCountryAr}
              onChange={handleChange}
              placeholder="تصميم بريطاني / تايوان"
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="originCountry">بلد المنشأ (إنجليزي)</Label>
            <Input
              id="originCountry"
              name="originCountry"
              value={form.originCountry}
              onChange={handleChange}
              placeholder="UK Design / Taiwan Production"
              dir="ltr"
            />
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6">
        <h3 className="text-sm font-semibold text-foreground/70">
          الصور والفيديو
        </h3>
        <div className="flex flex-col gap-2">
          <Label>صور المنتج</Label>
          <ImageManager
            images={form.images}
            onChange={(images) => setForm({ ...form, images })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>فيديو المنتج (اختياري)</Label>
          <VideoManager
            video={form.video}
            onChange={(video) => setForm({ ...form, video })}
          />
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6">
        <h3 className="text-sm font-semibold text-foreground/70">المميزات</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="featuresArText">
              المميزات بالعربية (كل ميزة في سطر)
            </Label>
            <Textarea
              id="featuresArText"
              name="featuresArText"
              value={form.featuresArText}
              onChange={handleChange}
              rows={4}
              placeholder={"مقاوم للصدأ والتآكل\nسهل التركيب\nضمان 5 سنوات"}
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="featuresText">
              المميزات بالإنجليزية (كل ميزة في سطر)
            </Label>
            <Textarea
              id="featuresText"
              name="featuresText"
              value={form.featuresText}
              onChange={handleChange}
              rows={4}
              placeholder={
                "Rust and corrosion resistant\nEasy to install\n5-year warranty"
              }
              dir="ltr"
            />
          </div>
        </div>
      </section>

      {/* Badge & flags */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6">
        <h3 className="text-sm font-semibold text-foreground/70">
          الشارة والخصائص
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="badgeAr">نص الشارة (عربي)</Label>
            <Input
              id="badgeAr"
              name="badgeAr"
              value={form.badgeAr}
              onChange={handleChange}
              placeholder="إكسسوار مميز"
              className="text-right"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="badge">نص الشارة (إنجليزي)</Label>
            <Input
              id="badge"
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="Hardware Pick"
              dir="ltr"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border/50 p-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="isFeatured" className="cursor-pointer">
              منتج مميز
            </Label>
            <Switch
              id="isFeatured"
              checked={form.isFeatured}
              onCheckedChange={(checked) =>
                setForm({ ...form, isFeatured: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isBestSeller" className="cursor-pointer">
              الأكثر مبيعًا
            </Label>
            <Switch
              id="isBestSeller"
              checked={form.isBestSeller}
              onCheckedChange={(checked) =>
                setForm({ ...form, isBestSeller: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="inStock" className="cursor-pointer">
              متوفر في المخزون
            </Label>
            <Switch
              id="inStock"
              checked={form.inStock}
              onCheckedChange={(checked) =>
                setForm({ ...form, inStock: checked })
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
