"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import BlurText from "@/components/ui/BlurText";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { useApi } from "@/hooks/useApi";
import { Plus, Check, Tag, Percent, Wallet, ShoppingBag } from "lucide-react";
import { Promo } from "@/types/promo";

const PROMOS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/promos`;

type PromoForm = Omit<Promo, "createdAt">;

const emptyForm: PromoForm = {
  code: "",
  discountPercent: 0,
  fixedDiscount: 0,
  label: "",
  labelAr: "",
  minOrder: 0,
  isActive: true,
};

export default function ManagePromosPage() {
  const api = useApi();

  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<PromoForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Promo[]>(PROMOS_API_URL);
      setPromos([...res.data]);
    } catch (err) {
      console.log(err);
      setError("تعذر تحميل العروض، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const openAddDialog = () => {
    setForm(emptyForm);
    setFormError("");
    setDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (form.discountPercent <= 0 && form.fixedDiscount <= 0) {
      setFormError("يجب تحديد نسبة خصم أو مبلغ خصم ثابت على الأقل");
      return;
    }

    setSaving(true);

    try {
      await api.post(PROMOS_API_URL, form);
      setSuccess(`تم إضافة كود "${form.code}" بنجاح`);
      setDialogOpen(false);
      setForm(emptyForm);
      fetchPromos();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(
          err.response?.data?.message ??
            (err.response?.status === 409
              ? "هذا الكود مستخدم بالفعل"
              : "تعذر إضافة العرض، حاول مرة أخرى"),
        );
      } else {
        setFormError("حدث خطأ ما، حاول مرة أخرى");
      }
    } finally {
      setSaving(false);
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
              text="إدارة العروض"
              delay={100}
              animateBy="words"
              direction="top"
              className="font-nastaliq text-4xl font-normal tracking-tight mb-5"
            />
            <p className="text-sm text-foreground/50">
              أضف أكواد خصم جديدة لعملائك
            </p>
          </div>

          <Button size="lg" onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة عرض جديد
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

        {/* Promos list */}
        {!loading && !error && (
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.15, ...Animate.transition }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {promos.map((promo) => (
              <div
                key={promo.code}
                className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-5 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Tag className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                      <span
                        className="font-mono text-lg font-bold tracking-wide text-foreground/90"
                        dir="ltr"
                      >
                        {promo.code}
                      </span>
                      <span className="text-sm text-foreground/50">
                        {promo.labelAr}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      promo.isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-foreground/5 text-foreground/40"
                    }`}
                  >
                    {promo.isActive ? "فعّال" : "غير فعّال"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {promo.discountPercent > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-border/50 bg-background/60 px-3 py-1 text-xs text-foreground/70">
                      <Percent className="h-3 w-3" />
                      خصم {promo.discountPercent}%
                    </span>
                  )}
                  {promo.fixedDiscount > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-border/50 bg-background/60 px-3 py-1 text-xs text-foreground/70">
                      <Wallet className="h-3 w-3" />
                      خصم {promo.fixedDiscount.toLocaleString("ar-EG")} ج.م
                    </span>
                  )}
                  {promo.minOrder > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-border/50 bg-background/60 px-3 py-1 text-xs text-foreground/70">
                      <ShoppingBag className="h-3 w-3" />
                      حد أدنى {promo.minOrder.toLocaleString("ar-EG")} ج.م
                    </span>
                  )}
                </div>

                <span className="text-xs text-foreground/30">
                  {new Date(promo.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}

            {promos.length === 0 && (
              <p className="col-span-full mt-16 text-center text-foreground/40">
                لا توجد عروض حاليًا، ابدأ بإضافة عرض جديد
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Add dialog — no edit/delete anywhere */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="text-right">
          <DialogHeader>
            <DialogTitle>إضافة عرض جديد</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">الكود</Label>
              <Input
                id="code"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="SUMMER25"
                required
                dir="ltr"
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="labelAr">وصف العرض (عربي)</Label>
                <Input
                  id="labelAr"
                  name="labelAr"
                  value={form.labelAr}
                  onChange={handleChange}
                  placeholder="خصم الصيف"
                  required
                  className="text-right"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="label">وصف العرض (إنجليزي)</Label>
                <Input
                  id="label"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  placeholder="Summer Discount"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="discountPercent">نسبة الخصم (%)</Label>
                <Input
                  id="discountPercent"
                  name="discountPercent"
                  type="number"
                  value={form.discountPercent}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fixedDiscount">خصم ثابت (ج.م)</Label>
                <Input
                  id="fixedDiscount"
                  name="fixedDiscount"
                  type="number"
                  value={form.fixedDiscount}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>

            <p className="-mt-2 text-xs text-foreground/40">
              حدد نسبة خصم أو مبلغ ثابت (يمكنك ترك أحدهما صفرًا)
            </p>

            <div className="flex flex-col gap-2">
              <Label htmlFor="minOrder">الحد الأدنى للطلب (ج.م)</Label>
              <Input
                id="minOrder"
                name="minOrder"
                type="number"
                value={form.minOrder}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
              <Label htmlFor="isActive" className="cursor-pointer">
                تفعيل العرض فور الإضافة
              </Label>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isActive: checked })
                }
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
                {saving ? "جاري الإضافة..." : "إضافة العرض"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
