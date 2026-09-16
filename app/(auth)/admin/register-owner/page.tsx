"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BlurText from "@/components/ui/BlurText";
import axios from "axios";
import { RegisterPayload } from "@/types/RegisterPayload";
import { Check } from "lucide-react";
import { useApi } from "@/hooks/useApi";

const emptyForm: RegisterPayload = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
};

export default function CreateAdminPage() {
  const api = useApi();
  const [form, setForm] = useState<RegisterPayload>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [lastCreatedName, setLastCreatedName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/Auth/register-owner`,
        form,
      );

      setLastCreatedName(`${form.firstName} ${form.lastName}`);
      setSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ??
          (err.response?.status === 409
            ? "هذا البريد الإلكتروني مستخدم بالفعل"
            : "تعذر إنشاء الحساب، حاول مرة أخرى");
        setError(message);
      } else {
        setError("حدث خطأ ما، حاول مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-6 py-28">
      <motion.div
        {...opacity}
        animate={{ ...Animate.animateonly }}
        transition={{ delay: 0.2, ...Animate.transition }}
        className="w-full max-w-lg rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-md sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            إدارة الحسابات
          </span>

          <BlurText
            text="إنشاء حساب ادمن جديد"
            delay={150}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-5xl font-normal tracking-tight mt-2 mb-5"
          />
          <p className="text-sm text-foreground/50">
            اضف حساب جديد لعمالك الجدد
          </p>
        </div>

        {/* Success state */}
        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-right"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground/90">
                  تم إنشاء الحساب بنجاح
                </span>
                <span className="text-xs text-foreground/50">
                  تمت إضافة {lastCreatedName} كأدمن جديد
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" dir="rtl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">الاسم الأول</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="كريم"
                value={form.firstName}
                onChange={handleChange}
                required
                className="text-right"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">الاسم الأخير</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="السيد"
                value={form.lastName}
                onChange={handleChange}
                required
                className="text-right"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="owner@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="text-right"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+201012345678"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              dir="ltr"
              className="text-right"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className="pl-10 text-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-foreground/40 hover:text-foreground"
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
            <p className="text-xs text-foreground/40">
              8 أحرف على الأقل، تحتوي على أحرف وأرقام
            </p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-2">
            {loading ? "جاري الإنشاء..." : "إنشاء حساب الأدمن"}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
