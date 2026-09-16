"use client";

import { motion } from "motion/react";
import { Animate, FadeDown, ViewPort } from "@/Animate";
import { Button } from "../ui/button";
import ModelScene from "../Scene/ModelScene";
import BlurText from "../ui/BlurText";

const OldKitchen = () => {
  return (
    <section className="relative h-screen flex flex-col md:flex-row-reverse justify-between items-center mt-20 gap-5 gap-y-10 overflow-hidden">
      <div className="flex flex-col justify-center items-start gap-5 w-full md:w-2/4 text-right px-5 pt-10">
        <BlurText
          text="مطبخ خشب"
          delay={200}
          animateBy="words"
          direction="top"
          className="font-nastaliq text-primary mb-5 text-5xl md:text-6xl font-extrabold tracking-tight"
        />

        <BlurText
          text="يتميّز هذا المطبخ بتصميمه الخشبي الكلاسيكي الذي يضيف للمكان إحساسًا بالدفء والفخامة في نفس الوقت. تفاصيل الخشب وتشطيبته الراقية تمنحه طابعًا أصيلًا وأنيقًا بعيدًا عن التصميمات التقليدية المملة، مع توزيع عملي للمساحات يضمن الراحة وسهولة الاستخدام. اختيار الخامات والألوان بعناية يجعل المطبخ قطعة أساسية في المكان، تجمع بين جمال الطابع الكلاسيكي وجودة تدوم لسنين."
          delay={50}
          animateBy="words"
          direction="top"
          className="text-2xl leading-loose text-foreground/90 mb-8"
        />

        <motion.div
          {...FadeDown}
          whileInView={{ ...Animate.animateonly }}
          viewport={{ ...ViewPort.viewport }}
          transition={{ delay: 2, duration: Animate.transition.duration }}
          className="flex gap-4 mt-2"
        >
          <Button size="lg" link="/products">
            تصفح منتجاتنا
          </Button>
        </motion.div>
      </div>
      <div className="w-full h-70 md:max-w-2/4 md:h-full rounded-2xl md:rounded-none md:rounded-l-2xl overflow-hidden  bg-red-600">
        <ModelScene
          modelSrc="/3d_models/wooden_kitchen-optimized.glb"
          light={{ enabled: true, position: [0, 0, 0], intensity: 2 }}
          environment={{ enabled: true, preset: "apartment" }}
          orbitControls={{
            enabled: true,
            target: [2, 0.5, 0],
            autoRotate: false,
            enablePan: false,
            enableZoom: true,
            minDistance: 1,
            maxDistance: 5,
            minPolarAngle: Math.PI / 3.8,
            maxPolarAngle: Math.PI / 2.8,
            minAzimuthAngle: -Math.PI / 4,
            maxAzimuthAngle: Math.PI / 3,
          }}
        />
      </div>
    </section>
  );
};

export default OldKitchen;
