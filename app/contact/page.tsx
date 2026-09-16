"use client";

import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";
import BlurText from "@/components/ui/BlurText";
import Silk from "@/components/Animated_Background/Silk";

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-7 w-7"
    aria-hidden="true"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 18.11h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.14.82.84-3.06-.2-.32a8.19 8.19 0 0 1-1.26-4.32c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.53-3.69 8.18-8.21 8.18Zm4.51-6.15c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14 0-.31-.01-.47-.01a.9.9 0 0 0-.65.31c-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-7 w-7"
    aria-hidden="true"
  >
    <path d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.16a4.9 4.9 0 0 0-1.16 1.77c-.25.64-.42 1.37-.47 2.43C2 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.16 1.77.55.55 1.11.9 1.77 1.16.64.25 1.37.42 2.43.47C8.94 22 9.28 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47.66-.26 1.22-.6 1.77-1.16.55-.55.9-1.11 1.16-1.77.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.16-1.77 4.9 4.9 0 0 0-1.77-1.16c-.64-.25-1.37-.42-2.43-.47C15.06 2 14.72 2 12 2Zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.21 1.85.34.47.18.8.4 1.15.75.35.35.57.68.75 1.15.13.36.29.87.34 1.85.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.05.98-.21 1.5-.34 1.85-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.35.13-.87.29-1.85.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.05-1.5-.21-1.85-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.13-.35-.29-.87-.34-1.85C3.81 14.99 3.8 14.67 3.8 12s.01-2.99.06-4.04c.05-.98.21-1.5.34-1.85.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.35-.13.87-.29 1.85-.34C9.01 3.81 9.33 3.8 12 3.8Zm0 3.05a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3Zm0 8.5a3.35 3.35 0 1 1 0-6.7 3.35 3.35 0 0 1 0 6.7Zm5.35-8.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-7 w-7"
    aria-hidden="true"
  >
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.25C16.16 4.2 15 4 13.7 4c-2.63 0-4.2 1.6-4.2 4.5V10.5H7v3h2.5V21h4Z" />
  </svg>
);

const socials = [
  {
    name: "واتساب",
    desc: "راسلنا مباشرة وهنرد عليك بسرعة",
    href: "https://wa.me/201000000000",
    Icon: WhatsAppIcon,
    hoverRing: "hover:ring-emerald-500/40",
    hoverText: "group-hover:text-emerald-500",
  },
  {
    name: "انستغرام",
    desc: "تابع أحدث أعمالنا وتصاميمنا",
    href: "https://instagram.com/",
    Icon: InstagramIcon,
    hoverRing: "hover:ring-pink-500/40",
    hoverText: "group-hover:text-pink-500",
  },
  {
    name: "فيسبوك",
    desc: "زور صفحتنا وتفاعل معنا",
    href: "https://facebook.com/",
    Icon: FacebookIcon,
    hoverRing: "hover:ring-blue-500/40",
    hoverText: "group-hover:text-blue-500",
  },
];

export default function Page() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center gap-14 overflow-hidden pb-24 pt-22 md:pt-0">
      <div className="flex flex-col items-center gap-5 text-white">
        <BlurText
          text="تواصل معنا"
          delay={200}
          animateBy="words"
          direction="top"
          className="font-nastaliq text-7xl font-normal tracking-tight mb-5"
        />

        <BlurText
          text="يسعدنا تواصلك معنا في أي وقت عبر وسائل التواصل الاجتماعي"
          delay={50}
          animateBy="words"
          direction="top"
          className="max-w-xl justify-center text-center text-xl leading-loose text-white/60"
        />
      </div>

      <motion.div
        {...opacity}
        animate={{ ...Animate.animateonly }}
        transition={{ delay: 1.2, ...Animate.transition }}
        className="flex flex-wrap justify-center gap-6 px-5 md:px-0"
      >
        {socials.map(({ name, desc, href, Icon, hoverRing, hoverText }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex w-full md:w-56 flex-col items-center gap-4 rounded-2xl border border-border/50 bg-accent/40 p-8 text-center backdrop-blur-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:bg-background ${hoverRing}`}
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full border border-border/50 text-white/70 group-hover:text-black/80 transition-colors duration-300 ${hoverText}`}
            >
              <Icon />
            </span>
            <span className="text-lg font-medium text-white/90 group-hover:text-black/80">
              {name}
            </span>
            <span className="text-sm leading-relaxed text-white/50 group-hover:text-black/80">
              {desc}
            </span>
          </a>
        ))}
      </motion.div>

      <div className="absolute top-0 left-0 -z-10 h-full min-h-screen w-full">
        <Silk
          speed={5}
          scale={1}
          color="#7d5329"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
    </main>
  );
}
