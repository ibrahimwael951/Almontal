"use client";

import { motion } from "motion/react";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = "جاري التحميل..." }: LoadingProps) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6">
      {/* Pulsing brand mark */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* outer pulsing ring */}
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-primary"
        />

        {/* mid ring */}
        <motion.span
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.1, 0.6] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="absolute inset-0 rounded-full bg-primary"
        />

        {/* spinning ring */}
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-l-primary/40"
        />

        {/* center dot / logo mark */}
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-lg font-bold text-white shadow-md">
          م
        </span>
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-sm text-foreground/50"
      >
        {text}
      </motion.p>
    </main>
  );
}
