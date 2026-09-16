"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import { useAuth } from "@/context/AuthProvider";
import Loading from "@/components/ui/Loading";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (user?.roles[0] == "Owner") {
      router.push("/admin");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user || isLoading || user.roles[0] == "Owner") return <Loading />;

  const fields = [
    { label: "الاسم الأول", value: user.firstName },
    { label: "الاسم الأخير", value: user.lastName },
    { label: "البريد الإلكتروني", value: user.email },
    { label: "رقم الهاتف", value: user.phoneNumber },
    { label: "نوع الحساب", value: user.roles[0] },
    {
      label: "تاريخ الانضمام",
      value: new Date(user.createdAt).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
  return (
    <main
      dir="rtl"
      className="flex min-h-screen w-full items-center justify-center px-6 py-28"
    >
      <motion.div
        {...opacity}
        animate={{ ...Animate.animateonly }}
        transition={{ delay: 0.2, ...Animate.transition }}
        className="w-full max-w-lg rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-md sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
            {initials || "؟"}
          </div>

          <div className="flex flex-col gap-1">
            <BlurText
              text={`${user.firstName}  ${user.lastName}`}
              delay={100}
              animateBy="words"
              direction="top"
              className="font-nastaliq text-4xl font-normal tracking-tight mb-3"
            />
            <p className="text-sm text-foreground/50">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-4 py-3"
            >
              <span className="text-sm text-foreground/50">{field.label}</span>
              <span className="text-sm font-medium text-foreground/90">
                {field.value || "—"}
              </span>
            </div>
          ))}
        </div>

        <Button size="lg" link="/dashboard/my-orders" className="mt-8 w-full">
          اورداراتي
        </Button>
        <Button
          variant="destructive"
          size="lg"
          onClick={handleLogout}
          className="mt-8 w-full"
        >
          تسجيل الخروج
        </Button>
      </motion.div>
    </main>
  );
}
