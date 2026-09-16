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
import { Plus, Pencil, Trash2, Check, MapPin, Star } from "lucide-react";
import { Location } from "@/types/locations";

const LOCATIONS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/locations`;

type LocationForm = Omit<Location, "id">;

const emptyForm: LocationForm = {
  name: "",
  nameAr: "",
  address: "",
  addressAr: "",
  hours: "",
  hoursAr: "",
  phone: "",
  stockStatus: "",
  stockStatusAr: "",
  isDefault: false,
};

export default function ManageLocationsPage() {
  const api = useApi();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LocationForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Location[]>(LOCATIONS_API_URL);
      setLocations(res.data);
    } catch (err) {
      console.log(err);
      setError("تعذر تحميل الفروع، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

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

  const openEditDialog = (loc: Location) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      nameAr: loc.nameAr,
      address: loc.address,
      addressAr: loc.addressAr,
      hours: loc.hours,
      hoursAr: loc.hoursAr,
      phone: loc.phone,
      stockStatus: loc.stockStatus,
      stockStatusAr: loc.stockStatusAr,
      isDefault: loc.isDefault,
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      if (editingId) {
        await api.put(`${LOCATIONS_API_URL}/${editingId}`, form);
        setSuccess("تم تعديل الفرع بنجاح");
      } else {
        await api.post(LOCATIONS_API_URL, form);
        setSuccess("تم إضافة الفرع بنجاح");
      }

      setDialogOpen(false);
      fetchLocations();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(
          err.response?.data?.message ?? "تعذر حفظ الفرع، حاول مرة أخرى",
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
      await api.delete(`${LOCATIONS_API_URL}/${deleteTarget.id}`);
      setSuccess(`تم حذف "${deleteTarget.nameAr}" بنجاح`);
      setDeleteTarget(null);
      fetchLocations();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "تعذر حذف الفرع، حاول مرة أخرى",
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
              text="إدارة الفروع"
              delay={100}
              animateBy="words"
              direction="top"
              className="font-nastaliq text-4xl font-normal tracking-tight mb-5"
            />
            <p className="text-sm text-foreground/50">
              أضف، عدّل أو احذف فروع المتجر
            </p>
          </div>

          <Button size="lg" onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة فرع جديد
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

        {/* Locations list */}
        {!loading && !error && (
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.15, ...Animate.transition }}
            className="mt-8 flex flex-col gap-3"
          >
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-5 backdrop-blur-sm transition-colors hover:bg-background/60 sm:flex-row sm:items-center"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground/90">
                      {loc.nameAr}
                    </span>
                    {loc.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        رئيسي
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-foreground/50">
                    {loc.addressAr}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-foreground/40">
                    <span dir="ltr">{loc.phone}</span>
                    <span>{loc.hoursAr}</span>
                    <span>{loc.stockStatusAr}</span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => openEditDialog(loc)}
                    aria-label="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setDeleteTarget(loc)}
                    aria-label="حذف"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {locations.length === 0 && (
              <p className="mt-16 text-center text-foreground/40">
                لا توجد فروع حاليًا، ابدأ بإضافة فرع جديد
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          dir="rtl"
          className="max-h-[85vh] max-w-2xl! overflow-y-auto text-right z-10000"
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? "تعديل الفرع" : "إضافة فرع جديد"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nameAr">اسم الفرع (عربي)</Label>
                <Input
                  id="nameAr"
                  name="nameAr"
                  value={form.nameAr}
                  onChange={handleChange}
                  required
                  className="text-right"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">اسم الفرع (إنجليزي)</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="addressAr">العنوان (عربي)</Label>
              <Input
                id="addressAr"
                name="addressAr"
                value={form.addressAr}
                onChange={handleChange}
                required
                className="text-right"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">العنوان (إنجليزي)</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="hoursAr">ساعات العمل (عربي)</Label>
                <Input
                  id="hoursAr"
                  name="hoursAr"
                  value={form.hoursAr}
                  onChange={handleChange}
                  placeholder="9 ص - 10 م"
                  className="text-right"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="hours">ساعات العمل (إنجليزي)</Label>
                <Input
                  id="hours"
                  name="hours"
                  value={form.hours}
                  onChange={handleChange}
                  placeholder="9 AM - 10 PM"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                dir="ltr"
                placeholder="+201012345678"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="stockStatusAr">حالة المخزون (عربي)</Label>
                <Input
                  id="stockStatusAr"
                  name="stockStatusAr"
                  value={form.stockStatusAr}
                  onChange={handleChange}
                  placeholder="متوفر"
                  className="text-right"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stockStatus">حالة المخزون (إنجليزي)</Label>
                <Input
                  id="stockStatus"
                  name="stockStatus"
                  value={form.stockStatus}
                  onChange={handleChange}
                  placeholder="InStock"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
              <Label htmlFor="isDefault" className="cursor-pointer">
                تعيين كفرع رئيسي
              </Label>
              <Switch
                id="isDefault"
                checked={form.isDefault}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isDefault: checked })
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
                {saving
                  ? "جاري الحفظ..."
                  : editingId
                    ? "حفظ التعديلات"
                    : "إضافة الفرع"}
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
            <AlertDialogTitle>حذف الفرع؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف فرع "{deleteTarget?.nameAr}" نهائيًا. لا يمكن التراجع عن
              هذا الإجراء.
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
