"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BlurText from "@/components/ui/BlurText";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import type { Category, CategoryForm } from "@/types/categories";
import { Plus, Pencil, Trash2, Check } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { PaginatedResponse } from "@/types/PaginatedResponse";

const CATEGORIES_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/categories`;

const emptyForm: CategoryForm = {
  name: "",
  nameAr: "",
  icon: "",
  slug: "",
  displayOrder: 0,
};

export default function ManageCategoriesPage() {
  const api = useApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Category[] | PaginatedResponse<Category>>(
        CATEGORIES_API_URL,
      );

      const list = Array.isArray(res.data) ? res.data : res.data.items;
      setCategories([...list].sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (err) {
      console.log(err);
      setError("تعذر تحميل الفئات، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // auto-dismiss success toast
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const openAddDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      nameAr: cat.nameAr,
      icon: cat.icon,
      slug: cat.slug,
      displayOrder: cat.displayOrder,
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "displayOrder" ? Number(value) : value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      if (editingId) {
        await api.put(`${CATEGORIES_API_URL}/${editingId}`, form);
        setSuccess("تم تعديل الفئة بنجاح");
      } else {
        await api.post(CATEGORIES_API_URL, form);
        setSuccess("تم إضافة الفئة بنجاح");
      }

      setDialogOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(
          err.response?.data?.message ?? "تعذر حفظ الفئة، حاول مرة أخرى",
        );
      } else {
        setFormError("حدث خطأ ما، حاول مرة أخرى");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`${CATEGORIES_API_URL}/${deleteTarget.id}`);
      setSuccess(`تم حذف "${deleteTarget.nameAr}" بنجاح`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "تعذر حذف الفئة، حاول مرة أخرى",
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
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div className="flex flex-col gap-1">
            <BlurText
              text="إدارة الفئات"
              delay={100}
              animateBy="words"
              direction="top"
              className="font-nastaliq text-4xl font-normal tracking-tight mb-5"
            />
            <p className="text-sm text-foreground/50">
              أضف، عدّل أو احذف فئات المنتجات
            </p>
          </div>

          <Button size="lg" onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة فئة جديدة
          </Button>
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

        {/* Error banner */}
        {error && !loading && (
          <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
          </div>
        )}

        {/* Categories list */}
        {!loading && !error && (
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.15, ...Animate.transition }}
            className="mt-8 flex flex-col gap-3"
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/40 p-4 backdrop-blur-sm transition-colors hover:bg-background/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
                  {cat.icon || "📦"}
                </span>

                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="font-medium text-foreground/90">
                    {cat.nameAr}
                  </span>
                  <span className="text-xs text-foreground/40" dir="ltr">
                    {cat.name} · /{cat.slug}
                  </span>
                </div>

                <span className="hidden shrink-0 rounded-full bg-foreground/5 px-3 py-1 text-xs text-foreground/50 sm:block">
                  {cat.productsCount} منتج
                </span>

                <div className="flex shrink-0 gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => openEditDialog(cat)}
                    aria-label="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setDeleteTarget(cat)}
                    aria-label="حذف"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <p className="mt-16 text-center text-foreground/40">
                لا توجد فئات حاليًا، ابدأ بإضافة فئة جديدة
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="text-right">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nameAr">الاسم بالعربية</Label>
                <Input
                  id="nameAr"
                  name="nameAr"
                  value={form.nameAr}
                  onChange={handleFormChange}
                  placeholder="أسطح المطبخ"
                  required
                  className="text-right"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">الاسم بالإنجليزية</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Countertops"
                  required
                  dir="ltr"
                  className="text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="icon">الأيقونة (إيموجي)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={form.icon}
                  onChange={handleFormChange}
                  placeholder="🪨"
                  className="text-center"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="displayOrder">ترتيب العرض</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  value={form.displayOrder}
                  onChange={handleFormChange}
                  min={0}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">الرابط (slug)</Label>
              <Input
                id="slug"
                name="slug"
                value={form.slug}
                onChange={handleFormChange}
                placeholder="countertops"
                required
                dir="ltr"
                className="text-right"
              />
            </div>

            {formError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                {formError}
              </p>
            )}

            <DialogFooter className="mt-2 gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? "جاري الحفظ..."
                  : editingId
                    ? "حفظ التعديلات"
                    : "إضافة الفئة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الفئة؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف فئة "{deleteTarget?.nameAr}" نهائيًا
              {deleteTarget && deleteTarget.productsCount > 0 && (
                <>
                  {" "}
                  — تحتوي هذه الفئة على {deleteTarget.productsCount} منتج، تأكد
                  من نقلهم أولًا.
                </>
              )}
              . لا يمكن التراجع عن هذا الإجراء.
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
