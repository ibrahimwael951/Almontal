"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import BlurText from "@/components/ui/BlurText";
import ProductImage from "@/components/products/productImage";
import axios from "axios";
import type { Product } from "@/types/products";
import type { Category } from "@/types/categories";
import { PaginatedResponse } from "@/types/PaginatedResponse";

const CATEGORIES_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/categories`;
const PRODUCTS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/products`;

const sortOptions = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  { value: "rating", label: "الأعلى تقييمًا" },
];

interface FiltersPanelProps {
  searchInput: string;
  setSearchInput: (v: string) => void;
  onSearchSubmit: () => void;
  category: string;
  categories: Category[];
  totalCount: number;
  featured: string;
  bestseller: string;
  inStock: string;
  sortBy: string;
  updateParams: (updates: Record<string, string | null>) => void;
}

function FiltersPanel({
  searchInput,
  setSearchInput,
  onSearchSubmit,
  category,
  categories,
  totalCount,
  featured,
  bestseller,
  inStock,
  sortBy,
  updateParams,
}: FiltersPanelProps) {
  return (
    <div className="flex w-full flex-col gap-8" dir="rtl">
      {/* Search */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="search">بحث</Label>
        <div className="flex gap-2">
          <Input
            id="search"
            placeholder="ابحث عن منتج..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearchSubmit();
            }}
            className="text-right"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={onSearchSubmit}
            aria-label="بحث"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <Label>الفئات</Label>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => updateParams({ category: null })}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              category === ""
                ? "bg-foreground/10 font-medium text-foreground"
                : "text-foreground/60 hover:bg-foreground/5"
            }`}
          >
            <span>الكل</span>
            <span className="text-xs opacity-50">{totalCount}</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams({ category: cat.id })}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                category === cat.id
                  ? "bg-foreground/10 font-medium text-foreground"
                  : "text-foreground/60 hover:bg-foreground/5"
              }`}
            >
              <span>{cat.nameAr}</span>
              <span className="text-xs opacity-50">{cat.productsCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-2">
        <Label>خصائص</Label>
        <div className="flex flex-col gap-1">
          <ToggleRow
            label="منتجات مميزة"
            active={featured === "true"}
            onClick={() =>
              updateParams({ featured: featured === "true" ? null : "true" })
            }
          />
          <ToggleRow
            label="الأكثر مبيعًا"
            active={bestseller === "true"}
            onClick={() =>
              updateParams({
                bestseller: bestseller === "true" ? null : "true",
              })
            }
          />
          <ToggleRow
            label="متوفر فقط"
            active={inStock === "true"}
            onClick={() =>
              updateParams({ inStock: inStock === "true" ? null : "true" })
            }
          />
        </div>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="sortBy">الترتيب حسب</Label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => updateParams({ sortBy: e.target.value })}
          className="w-full rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm text-right outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear filters */}
      {(category || searchInput || featured || bestseller || inStock) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchInput("");
            updateParams({
              category: null,
              search: null,
              featured: null,
              bestseller: null,
              inStock: null,
            });
          }}
        >
          إعادة تعيين الفلاتر
        </Button>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-foreground/10 font-medium text-foreground"
          : "text-foreground/60 hover:bg-foreground/5"
      }`}
    >
      <span>{label}</span>
      <span
        className={`h-4 w-4 rounded-full border transition-colors ${
          active
            ? "border-primary bg-primary"
            : "border-foreground/30 bg-transparent"
        }`}
      />
    </button>
  );
}

// ---------- Main page ----------

export function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const category = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";
  const featured = searchParams.get("featured") ?? "";
  const bestseller = searchParams.get("bestseller") ?? "";
  const inStock = searchParams.get("inStock") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "newest";
  const pageNumber = Number(searchParams.get("pageNumber") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "12");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (!("pageNumber" in updates)) {
        params.set("pageNumber", "1");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearchSubmit = useCallback(() => {
    updateParams({ search: searchInput || null });
  }, [searchInput, updateParams]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[] | PaginatedResponse<Category>>(
          CATEGORIES_API_URL,
        );
        const list = Array.isArray(res.data) ? res.data : res.data.items;
        setCategories(
          [...list].sort((a, b) => a.displayOrder - b.displayOrder),
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError("");

      try {
        const res = await axios.get<PaginatedResponse<Product>>(
          PRODUCTS_API_URL,
          {
            params: {
              category: category || undefined,
              search: search || undefined,
              featured: featured || undefined,
              bestseller: bestseller || undefined,
              inStock: inStock || undefined,
              sortBy: sortBy || undefined,
              pageNumber,
              pageSize,
            },
          },
        );

        setProducts(res.data.items);
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log(err);
        setError("تعذر تحميل المنتجات، حاول مرة أخرى لاحقًا");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [
    category,
    search,
    featured,
    bestseller,
    inStock,
    sortBy,
    pageNumber,
    pageSize,
  ]);

  const loading = loadingProducts || loadingCategories;

  const filtersPanelProps: FiltersPanelProps = {
    searchInput,
    setSearchInput,
    onSearchSubmit: handleSearchSubmit,
    category,
    categories,
    totalCount,
    featured,
    bestseller,
    inStock,
    sortBy,
    updateParams,
  };

  return (
    <main className="relative w-full px-6 pb-24 pt-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <BlurText
          text="منتجاتنا"
          delay={150}
          animateBy="words"
          direction="top"
          className="font-nastaliq text-7xl font-normal tracking-tight"
        />
        <BlurText
          text="تشكيلة متنوعة من المطابخ والحمامات والأعمال الخشبية، مصنوعة بعناية لتناسب ذوقك"
          delay={50}
          animateBy="words"
          direction="top"
          className="max-w-xl text-xl leading-loose text-foreground/60"
        />
      </div>

      {/* Mobile: filter trigger */}
      <div className="mx-auto mt-8 flex max-w-6xl justify-end lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full">
              الفلاتر
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 z-10000">
            <ScrollArea className="h-screen overflow-y-auto p-6">
              <SheetTitle className="mb-4 text-right">الفلاتر</SheetTitle>
              <FiltersPanel {...filtersPanelProps} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl items-start gap-10">
        {/* Product grid */}
        <div className="flex-1">
          {loading && (
            <div className="mt-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
            </div>
          )}

          {!loading && error && (
            <p className="mt-20 text-center text-destructive">{error}</p>
          )}

          {!loading && !error && (
            <motion.div
              {...opacity}
              animate={{ ...Animate.animateonly }}
              transition={{ delay: 0.3, ...Animate.transition }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-background/60"
                >
                  <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-linear-to-br from-primary/40 to-primary/20 ">
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.nameAr}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute right-3 top-3 rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-foreground/70 backdrop-blur-sm">
                      {product.categoryNameAr}
                    </span>

                    {product.badgeAr && (
                      <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white">
                        {product.badgeAr}
                      </span>
                    )}

                    {!product.inStock && (
                      <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-medium text-foreground/70 backdrop-blur-sm">
                        غير متوفر حاليًا
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-6 text-right">
                    <h3 className="text-lg font-semibold text-foreground/90">
                      {product.nameAr}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-foreground/50">
                      {product.shortDescriptionAr}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-primary">
                          {product.price.toLocaleString("ar-EG")} ج.م
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-foreground/40 line-through">
                            {product.originalPrice.toLocaleString("ar-EG")} ج.م
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        link={`/products/${product.id}`}
                        disabled={!product.inStock}
                      >
                        التفاصيل
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="mt-20 text-center text-foreground/40">
              لا توجد منتجات تطابق بحثك
            </p>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pageNumber <= 1}
                onClick={() =>
                  updateParams({ pageNumber: String(pageNumber - 1) })
                }
              >
                السابق
              </Button>
              <span className="text-sm text-foreground/50">
                صفحة {pageNumber} من {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={pageNumber >= totalPages}
                onClick={() =>
                  updateParams({ pageNumber: String(pageNumber + 1) })
                }
              >
                التالي
              </Button>
            </div>
          )}
        </div>

        {/* Desktop: filter sidebar on the right */}
        <motion.aside
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.2, ...Animate.transition }}
          className="hidden w-72 shrink-0 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm lg:block"
        >
          <FiltersPanel {...filtersPanelProps} />
        </motion.aside>
      </div>
    </main>
  );
}
export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
