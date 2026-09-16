"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Animate, opacity } from "@/Animate";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText";
import axios from "axios";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Location } from "@/types/locations";

const LOCATIONS_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/locations`;

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get<Location[]>(LOCATIONS_API_URL);
        setLocations(res.data);
        const defaultLoc = res.data.find((l) => l.isDefault) ?? res.data[0];
        setActiveId(defaultLoc?.id ?? null);
      } catch (err) {
        console.log(err);
        setError("تعذر تحميل الفروع، حاول مرة أخرى لاحقًا");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const active = locations.find((l) => l.id === activeId) ?? null;

  return (
    <main dir="rtl" className="relative w-full px-6 pb-24 pt-28">
      {/* Header */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <BlurText
          text="فروعنا"
          delay={150}
          animateBy="words"
          direction="top"
          className="font-nastaliq text-7xl font-normal tracking-tight"
        />
        <BlurText
          text="تفضل بزيارة أقرب فرع لك، أو تواصل معنا مباشرة لمعرفة تفاصيل أكثر"
          delay={50}
          animateBy="words"
          direction="top"
          className="max-w-xl text-xl leading-loose text-foreground/60"
        />
      </div>

      {loading && (
        <div className="mt-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
        </div>
      )}

      {!loading && error && (
        <p className="mt-20 text-center text-destructive">{error}</p>
      )}

      {!loading && !error && locations.length === 0 && (
        <p className="mt-20 text-center text-foreground/40">
          لا توجد فروع متاحة حاليًا
        </p>
      )}

      {!loading && !error && locations.length > 0 && active && (
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ ...Animate.transition }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-3xl border border-border/50 bg-background/40 backdrop-blur-sm"
              >
                {/* Map-style header */}
                <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-linear-to-br from-primary/15 via-secondary/10 to-accent/10">
                  <svg
                    className="absolute inset-0 h-full w-full opacity-40"
                    aria-hidden="true"
                  >
                    <defs>
                      <pattern
                        id="grid-pattern"
                        width="32"
                        height="32"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 32 0 L 0 0 0 32"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          className="text-foreground/10"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill="url(#grid-pattern)"
                    />
                  </svg>

                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                  >
                    <MapPin className="h-7 w-7" />
                    <motion.span
                      animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 rounded-full bg-primary"
                    />
                  </motion.span>

                  {active.isDefault && (
                    <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-current" />
                      الفرع الرئيسي
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6 p-8">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-foreground/90">
                      {active.nameAr}
                    </h2>
                    <p className="leading-relaxed text-foreground/60">
                      {active.addressAr}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <InfoRow
                      icon={Clock}
                      label="ساعات العمل"
                      value={active.hoursAr}
                    />
                    <InfoRow
                      icon={Phone}
                      label="رقم الهاتف"
                      value={active.phone}
                      dirLtr
                    />
                    <InfoRow
                      icon={CheckCircle2}
                      label="حالة المخزون"
                      value={active.stockStatusAr}
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/50 pt-6 sm:flex-row">
                    <Button asChild size="lg" className="flex-1 gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          active.address,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-4 w-4" />
                        الحصول على الاتجاهات
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <a href={`tel:${active.phone}`}>
                        <Phone className="h-4 w-4" />
                        اتصل بالفرع
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            {...opacity}
            animate={{ ...Animate.animateonly }}
            transition={{ delay: 0.1, ...Animate.transition }}
            className="flex flex-col gap-3"
          >
            {locations.map((loc) => {
              const isActive = loc.id === activeId;

              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveId(loc.id)}
                  className={`relative flex flex-col gap-3 rounded-2xl border p-5 text-right transition-colors duration-300 ${
                    isActive
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/50 bg-background/40 hover:bg-background/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground/90">
                          {loc.nameAr}
                        </h3>
                        {loc.isDefault && (
                          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            رئيسي
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/50">
                        {loc.addressAr}
                      </p>
                    </div>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/50 bg-background/60 text-foreground/40"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium `}
                    >
                      {loc.stockStatusAr}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-foreground/40">
                      <Clock className="h-3 w-3" />
                      {loc.hoursAr}
                    </span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </div>
      )}
    </main>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  dirLtr,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  dirLtr?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border/50 bg-background/40 p-4">
      <div className="flex items-center gap-1.5 text-foreground/80">
        <Icon className="w-6 h-6 text-primary" />
        <span className="text-sm">{label}</span>
      </div>
      <span
        className="text-sm font-medium text-foreground/90"
        dir={dirLtr ? "ltr" : undefined}
      >
        {value || "—"}
      </span>
    </div>
  );
}
