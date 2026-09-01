"use client";

import { Button } from "@/components/ui/button";
import Plasma from "../Animated_Background/Plasma";
import BlurText from "../ui/BlurText";
import { motion } from "motion/react";
import { Animate, opacity } from "@/Animate";

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center gap-5">
      <BlurText
        text="ملك الألمونتال"
        delay={200}
        animateBy="words"
        direction="top"
        className="font-nastaliq text-8xl font-normal tracking-tight mb-10"
      />
      <BlurText
        text="في المونتال، نؤمن أن المطبخ هو قلب المنزل النابض، حيث تُصنع أجمل الذكريات وتُحاك أحاديث العائلة الدافئة."
        delay={50}
        animateBy="words"
        direction="top"
        className="max-w-2xl text-2xl leading-loose text-foreground/60 text-center! justify-center"
      />

      <motion.div
        {...opacity}
        animate={{ ...Animate.animateonly }}
        transition={{ delay: 1.6, ...Animate.transition }}
        className="flex gap-5"
      >
        <Button size="lg" link="/contact">
          تواصل معنا
        </Button>

        <Button size="lg" variant="outline" link="/about">
          من نحن؟
        </Button>
      </motion.div>
      <div className="absolute top-0 left-0 w-full h-screen -z-10">
        <Plasma
          color="#7d5329"
          speed={1}
          direction="forward"
          scale={1}
          opacity={1}
          mouseInteractive={false}
          lightMode
          renderScale={0.55}
          maxDpr={1.5}
          targetFps={60}
          iterations={60}
        />
      </div>
    </section>
  );
};

export default Hero;
