"use client";
import Silk from "../Animated_Background/Silk";
import BlurText from "../ui/BlurText";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { opacityWithBlur, ViewPort } from "@/Animate";

const HaveAPlan = () => {
  return (
    <motion.section
      {...opacityWithBlur}
      {...ViewPort}
      className="relative max-w-90 md:max-w-7xl h-fit mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center gap-10 md:gap-5 my-20 py-20 px-5 md:px-15 rounded-2xl overflow-hidden"
    >
      <div className="absolute top-0 left-0 h-full w-full -z-10">
        <Silk
          speed={5}
          scale={1}
          color="#7d5329"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      <h1 className="font-amiri text-5xl font-bold text-center text-white flex flex-col items-start gap-5">
        <BlurText
          text=" عندك فكره و عاوز تنفذها ؟!"
          delay={50}
          animateBy="words"
          direction="top"
          className="justify-center"
        />
        <BlurText
          text="خلينا نحولها لواقع.... "
          delay={50}
          animateBy="words"
          direction="top"
          className="justify-center"
        />
      </h1>

      <motion.div
        {...opacityWithBlur}
        viewport={{ ...ViewPort.viewport }}
        {...ViewPort.whileInView}
        transition={{ delay: 1, ...ViewPort.whileInView.transition }}
        className="flex flex-col justify-center items-center gap-5 w-full max-w-50"
      >
        <Button
          size={"lg"}
          variant={"secondary"}
          className="w-full text-2xl h-16 px-5"
          link="/contact"
        >
          تواصل معانا
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default HaveAPlan;
