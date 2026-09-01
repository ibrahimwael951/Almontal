const blur = "blur(5px)";
const distance = 60;
const duration = 0.3;

export const ViewPort = {
  viewport: { once: true, amount: 0.5 },
  whileInView: {
    y: 0,
    x: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration },
  },
};

export const Animate = {
  animate: {
    y: 0,
    x: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration },
  },
  animateonly: { y: 0, x: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
  transition: { duration },
};

export const FadeUp = {
  initial: { y: distance, opacity: 0, filter: blur },
  exit: { y: distance, opacity: 0, filter: blur },
};

export const FadeDown = {
  initial: { y: -distance, opacity: 0, filter: blur },
  exit: { y: -distance, opacity: 0, filter: blur },
};

export const FadeRight = {
  initial: { x: distance, opacity: 0, filter: blur },
  exit: { x: distance, opacity: 0, filter: blur },
};

export const FadeLeft = {
  initial: { x: -distance, opacity: 0, filter: blur },
  exit: { x: -distance, opacity: 0, filter: blur },
};

export const Rotate_Scale_Tap = {
  whileTap: { rotateZ: -6, scale: 0.94, transition: { duration: 0.04 } },
};

export const opacity = {
  initial: { opacity: 0, filter: blur },
  exit: { opacity: 0, filter: blur },
};

export const opacityWithBlur = {
  initial: { filter: blur, opacity: 0 },
  whileInView: { filter: "blur(0px)", opacity: 1 },
};
