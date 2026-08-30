"use client";
import { Button } from "@/components/ui/button";
import KitchenScene from "@/components/KitchenScene";
import BlurText from "@/components/ui/BlurText";
import { motion } from "motion/react";
import { Animate, FadeDown, FadeLeft } from "@/Animate";

const Hero = () => {
  return (
    <section className="h-screen flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex flex-col justify-center items-start gap-5 w-full md:w-2/4 max-w-xl text-right">
        <BlurText
          text="ألمونتال"
          animateBy="words"
          direction="top"
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary"
        />

        <motion.p
          {...FadeDown}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.4, duration: Animate.transition.duration }}
          className="text-lg leading-loose text-foreground/90"
        >
          في المونتال، نؤمن أن المطبخ هو قلب المنزل النابض، حيث تُصنع أجمل
          الذكريات وتُحاك أحاديث العائلة الدافئة. نحرص على تصميم كل مطبخ بعناية
          فائقة، تجمع بين الأناقة العصرية والراحة العملية، لنمنحك مساحة تعكس
          ذوقك الرفيع وتلبي احتياجاتك اليومية. من اختيار الخامات الفاخرة إلى أدق
          التفاصيل، نسعى لتحويل حلمك إلى واقع يفوق التوقعات.
        </motion.p>

        <motion.div
          {...FadeDown}
          animate={{ ...Animate.animateonly }}
          transition={{ delay: 0.6, duration: Animate.transition.duration }}
          className="flex gap-4 mt-2"
        >
          <Button size="lg" link="/contact">
            أرسل رسالة
          </Button>
          <Button size="lg" variant="outline" link="/kitchen">
            تصفح المطبخ
          </Button>
        </motion.div>
      </div>

      <motion.div
        {...FadeLeft}
        {...Animate}
        className="w-full md:md:w-2/4 max-w-250 h-150 rounded-2xl overflow-hidden shadow-lg"
      >
        <KitchenScene />
      </motion.div>
    </section>
  );
};

export default Hero;
