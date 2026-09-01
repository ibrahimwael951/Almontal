"use client";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Animate, FadeDown, ViewPort } from "@/Animate";
import ModelScene from "../Scene/ModelScene";
import BlurText from "../ui/BlurText";

const About = () => {
  return (
    <section
      id="about"
      className="md:h-screen min-h-screen w-full flex flex-col md:flex-row justify-between items-center gap-y-5 pt-24 md:pt-0 md:pr-10 bg-primary overflow-hidden"
    >
      <div className="flex flex-col justify-center items-start gap-5 w-full md:w-2/4 max-w-xl text-right px-5">
        <BlurText
          text=" ملك الألمونتال"
          delay={200}
          animateBy="words"
          direction="top"
          className="font-nastaliq text-accent mb-5 text-5xl md:text-6xl font-extrabold tracking-tight"
        />

        <BlurText
          text="في ألمونتال, نؤمن أن المطبخ هو قلب المنزل النابض، حيث تُصنع أجمل الذكريات وتُحاك أحاديث العائلة الدافئة. نحرص على تصميم كل مطبخ بعناية فائقة، تجمع بين الأناقة العصرية والراحة العملية، لنمنحك مساحة تعكس ذوقك الرفيع وتلبي احتياجاتك اليومية. من اختيار الخامات الفاخرة إلى أدق التفاصيل، نسعى لتحويل حلمك إلى واقع يفوق التوقعات."
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
          <Button size="lg" variant={"secondary"} link="/contact">
            تواصل معنا{" "}
          </Button>
        </motion.div>
      </div>

      <div className="w-full h-70 md:max-w-2/4 md:h-full rounded-2xl md:rounded-none md:rounded-r-2xl overflow-hidden  bg-red-600">
        <ModelScene
          modelSrc="/3d_models/kitchen-optimized.glb"
          light={false}
          environment={{ enabled: true, preset: "apartment" }}
          orbitControls={{
            enabled: true,
            autoRotate: false,
            autoRotateSpeed: 2,
            enablePan: false,
            enableZoom: true,
            minDistance: 1,
            maxDistance: 6.8,
            minPolarAngle: Math.PI / 3,
            maxPolarAngle: Math.PI / 2,
            minAzimuthAngle: -Math.PI / 8,
            maxAzimuthAngle: Math.PI / 8.2,
          }}
        />
      </div>
    </section>
  );
};

export default About;
