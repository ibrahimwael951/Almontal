"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { Animate, FadeDown } from "@/Animate";
import { useAuth } from "@/context/AuthProvider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Search, Menu, ShoppingCart } from "lucide-react";
import { getCartCount, CART_UPDATED_EVENT } from "@/lib/cart";

const navLinks = [
  { label: "من نحن؟", href: "/about" },
  { label: "منتجاتنا", href: "/products" },
  { label: "فروعنا", href: "/locations" },
  { label: "الأسئلة الشائعة", href: "/faq" },
  { label: "تواصل معنا", href: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());

    const handleUpdate = () => setCartCount(getCartCount());
    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setMobileOpen(false);
  };

  return (
    <motion.nav
      {...FadeDown}
      {...Animate}
      className="fixed top-2 left-2/4 -translate-x-2/4 p-3 px-5 w-[96%] max-w-5xl rounded-xl bg-accent/50 backdrop-blur-2xl flex justify-between items-center gap-4 z-50"
    >
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center justify-center gap-2"
        >
          <h1 className="font-nastaliq text-xl font-normal tracking-tight">
            ملك الألمونتال
          </h1>
        </Link>
        {/* Desktop search: expands inline */}
        <div className="hidden items-center md:flex">
          <AnimatePresenceSearch
            search={search}
            setSearch={setSearch}
            onSubmit={handleSearchSubmit}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-4">
        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-foreground"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* <ModeToggle /> */}
        {user ? (
          <Button
            size="sm"
            link={user.roles[0] === "Owner" ? "/admin" : "/dashboard"}
            className="hidden gap-1.5 sm:flex"
          >
            حسابي
          </Button>
        ) : (
          <Button size="sm" link="/login" className="hidden sm:flex">
            تسجيل الدخول
          </Button>
        )}

        {/* Cart btn */}
        <Button size="icon" variant="ghost" link="/cart" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute -top-1 -left-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </motion.span>
          )}
        </Button>

        {/* Mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" dir="rtl" className="w-80 text-right z-10000">
            <SheetTitle className="text-right font-nastaliq ">
              القائمة
            </SheetTitle>

            <div className="mt-6 flex flex-col gap-6 px-1">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="text-right"
                />
                <Button type="submit" size="icon" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-foreground/10 text-foreground"
                          : "text-foreground/60 hover:bg-foreground/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === "/cart"
                      ? "bg-foreground/10 text-foreground"
                      : "text-foreground/60 hover:bg-foreground/5"
                  }`}
                >
                  <span>السلة</span>
                  {cartCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Account action */}
              <div className="border-t border-border/50 pt-4">
                {user ? (
                  <Button
                    size="lg"
                    link={user.roles[0] === "Owner" ? "/admin" : "/dashboard"}
                    className="w-full gap-1.5"
                    onClick={() => setMobileOpen(false)}
                  >
                    حسابي
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    link="/login"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    تسجيل الدخول
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

function AnimatePresenceSearch({
  search,
  setSearch,
  onSubmit,
}: {
  search: string;
  setSearch: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ابحث عن منتج..."
        className="h-9 text-right"
      />
    </form>
  );
}

export default Navbar;
