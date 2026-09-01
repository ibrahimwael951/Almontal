"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";

const navLinks = [
  { href: "/about", label: "من نحن؟" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/kitchen", label: "المطبخ" },
];

const socialLinks = [
  {
    href: "https://facebook.com/yourpage",
    label: "فيسبوك",
    icon: FacebookIcon,
  },
  {
    href: "https://wa.me/201234567890",
    label: "واتساب",
    icon: WhatsAppIcon,
  },
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.25C16.16 4.2 15 4 13.7 4c-2.63 0-4.2 1.6-4.2 4.5V10.5H7v3h2.5V21h4Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.98.578 3.83 1.579 5.386L2 22l4.744-1.545A9.945 9.945 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.16 8.16 0 0 1-4.166-1.142l-.299-.177-3.11 1.012.994-3.036-.194-.31A8.16 8.16 0 0 1 3.8 12c0-4.529 3.671-8.2 8.2-8.2s8.2 3.671 8.2 8.2-3.671 8.2-8.199 8.2z" />
    </svg>
  );
}

const Footer = () => {
  return (
    <motion.footer
      {...opacity}
      animate={{ ...Animate.animateonly }}
      transition={{ ...Animate.transition }}
      className="relative w-full border-t border-border/50 pt-10 pb-30 flex flex-col items-center gap-6"
    >
      <h2 className="font-nastaliq text-3xl font-normal tracking-tight">
        ملك الألمونتال
      </h2>

      <nav className="flex gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-foreground/60 hover:text-foreground transition-colors text-sm"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex gap-4">
        {socialLinks.map((social) => (
          <Link
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-foreground/60 hover:text-foreground hover:border-foreground/50 transition-colors"
          >
            <social.icon className="h-5 w-5" />
          </Link>
        ))}
      </div>

      <p className="text-xs text-foreground/40">
        © {new Date().getFullYear()} ملك الألمونتال. جميع الحقوق محفوظة.
      </p>
    </motion.footer>
  );
};

export default Footer;
