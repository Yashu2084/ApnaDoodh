import { Variants } from "framer-motion";

export const PREMIUM_EASE = [0.16, 1, 0.3, 1]; // easeOutQuart / easeOutExpo hybrid

export const transitionStandard = {
  duration: 0.6,
  ease: PREMIUM_EASE,
};

export const transitionFast = {
  duration: 0.3,
  ease: PREMIUM_EASE,
};

export const hoverScaleCard = {
  y: -6,
  scale: 1.015,
  transition: { duration: 0.3, ease: PREMIUM_EASE },
};

export const hoverScaleButton = {
  scale: 1.02,
  y: -1,
  transition: { duration: 0.2, ease: "easeInOut" },
};

export const tapScaleButton = {
  scale: 0.98,
  y: 0,
  transition: { duration: 0.1, ease: "easeInOut" },
};

// Container that staggers children reveals
export const staggerContainer = (staggerDelay = 0.06): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

// Single element reveal
export const fadeInUpReveal: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: PREMIUM_EASE },
  },
};

export const fadeInReveal: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: PREMIUM_EASE },
  },
};
