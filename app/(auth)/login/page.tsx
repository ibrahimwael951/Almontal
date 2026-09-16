"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BlurText from "@/components/ui/BlurText";
import { useAuth } from "@/context/AuthProvider";
import type { LoginPayload } from "@/types/LoginPayload";
import axios from "axios";
import Loading from "@/components/ui/Loading";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, user } = useAuth();

  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.push("/dashboard");
    }
  }, [user, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ??
          (err.response?.status === 401
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            : "تعذر تسجيل الدخول، حاول مرة أخرى");
        setError(message);
      } else {
        setError("حدث خطأ ما، حاول مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || user) {
    return <Loading />;
  }
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-6 py-28">
      <motion.div
        {...opacity}
        animate={{ ...Animate.animateonly }}
        transition={{ delay: 0.2, ...Animate.transition }}
        className="w-full max-w-md rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-md sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <BlurText
            text="تسجيل الدخول"
            delay={150}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-5xl font-normal tracking-tight my-5"
          />
          <p className="text-sm text-foreground/50">
            سعداء برجوعك، سجل دخولك لمتابعة طلباتك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" dir="rtl">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
              required
              className="text-right"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">كلمة المرور</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
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
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-2">
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground/50">
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
