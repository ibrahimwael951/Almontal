"use client";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Animate, FadeDown, ViewPort } from "@/Animate";
import ModelScene from "../Scene/ModelScene";
import BlurText from "../ui/BlurText";

const SimpleKitchen = () => {
  return (
    <section className="md:h-screen min-h-screen w-full flex flex-col md:flex-row justify-between items-center gap-y-5 pt-24 mt-20 md:pt-0 md:pr-10 bg-primary overflow-hidden">
      <div className="flex flex-col justify-center items-start gap-5 w-full md:w-2/4 text-right">
        <BlurText
          text="مطبخ سيمبل عصري"
          delay={200}
          animateBy="words"
          direction="top"
          className="font-nastaliq text-accent mb-5 text-5xl md:text-6xl font-extrabold tracking-tight"
        />

        <BlurText
          text="يتميّز هذا المطبخ بتصميمه العصري والبسيط، اللي بيجمع بين الهدوء والأناقة والعملية من غير أي تفاصيل زيادة. ألوان متناسقة وخطوط نظيفة وتوزيع ذكي للمساحات بيخلوا كل حاجة في مكانها، مع تشطيبات ناعمة تضيف لمسة راقية للمكان. تصميم مناسب للي بيحب البساطة، لكن في نفس الوقت عايز مطبخ شيك، مريح، وعصري يفضل شكله جميل مهما مرّ الوقت"
          delay={50}
          animateBy="words"
          direction="top"
          className="text-2xl leading-loose text-accent/90 mb-8"
        />
        <motion.div
          {...FadeDown}
          whileInView={{ ...Animate.animateonly }}
          viewport={{ ...ViewPort.viewport }}
          transition={{ delay: 2, duration: Animate.transition.duration }}
          className="flex gap-4 mt-2"
        >
          <Button size="lg" variant={"secondary"} link="/kitchen">
            تصفح المطبخ
          </Button>
        </motion.div>
      </div>
      <div className="w-full h-70 md:max-w-2/4 md:h-full rounded-2xl md:rounded-none md:rounded-r-2xl overflow-hidden  bg-red-600">
        <ModelScene
          modelSrc="/3d_models/simple_kitchen-optimized.glb"
          light={false}
          environment={{ enabled: true, preset: "apartment" }}
          orbitControls={{
            target: [10, 1.5, -3.6],
            enabled: true,
            autoRotate: false,
            autoRotateSpeed: 2,
            enablePan: false,
            enableZoom: true,
            minDistance: -5,
            maxDistance: 5,
            minPolarAngle: Math.PI / 3,
            maxPolarAngle: Math.PI / 2,
            minAzimuthAngle: -Math.PI / 3,
            maxAzimuthAngle: Math.PI / 12.2,
          }}
        />
      </div>
    </section>
  );
};

export default SimpleKitchen;
