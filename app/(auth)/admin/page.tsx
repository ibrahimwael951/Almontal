"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";
import BlurText from "@/components/ui/BlurText";
import { useAuth } from "@/context/AuthProvider";
import {
  LayoutGrid,
  Package,
  MapPin,
  ShoppingCart,
  Tag,
  ChevronLeft,
  UserStar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const managementLinks = [
  {
    title: "إدارة الفئات",
    description: "أضف أو عدّل أو احذف فئات المنتجات",
    href: "/admin/Categories",
    icon: LayoutGrid,
  },
  {
    title: "إدارة المنتجات",
    description: "تحكم في منتجاتك، أسعارها وتوفرها",
    href: "/admin/Products",
    icon: Package,
  },
  {
    title: "إدارة الفروع",
    description: "أضف أو حدّث مواقع فروعك ومعارضك",
    href: "/admin/Locations",
    icon: MapPin,
  },
  {
    title: "الطلبات",
    description: "تابع طلبات العملاء وحالتها",
    href: "/admin/Orders",
    icon: ShoppingCart,
  },
  {
    title: "إدارة العروض",
    description: "أنشئ وأدر العروض والخصومات",
    href: "/admin/Promos",
    icon: Tag,
  },
  {
    title: "اضافه ادمن",
    description: "انشيء حساب ادمن جديد للعمال",
    href: "/admin/register-owner",
    icon: UserStar,
  },
];

export default function OwnerDashboardPage() {
  const { user, logout, isLoading } = useAuth();

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  return (
    <main dir="rtl" className="w-full px-6 pb-24 pt-28">
      <div className="mx-auto max-w-5xl">
        {/* Owner info */}
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ ...Animate.transition }}
          className="flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-8 text-center backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 sm:text-right"
        >
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground">
            {initials || "؟"}
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <span className="mx-auto w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:mx-0">
              حساب تاجر
            </span>
            <h1 className="text-2xl font-bold text-foreground/90">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-foreground/50">{user?.email}</p>
            {user?.phoneNumber && (
              <p className="text-sm text-foreground/50" dir="ltr">
                {user.phoneNumber}
              </p>
            )}
          </div>

          <Button
            onClick={logout}
            size={"lg"}
            variant={"destructive"}
            disabled={isLoading}
          >
            تسجيل الخروج
          </Button>
        </motion.div>

        {/* Heading */}
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.1, ...Animate.transition }}
          className="mt-14 flex flex-col gap-2"
        >
          <BlurText
            text="لوحة التحكم"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-nastaliq text-4xl font-normal tracking-tight mb-5"
          />
          <p className="text-foreground/50">
            تحكم في كل جوانب متجرك من مكان واحد
          </p>
        </motion.div>

        {/* Management cards */}
        <motion.div
          {...opacity}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.2, ...Animate.transition }}
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {managementLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-background/60"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ChevronLeft className="h-4 w-4 text-foreground/30 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-foreground/60" />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-foreground/90">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/50">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}
