import { motion, useScroll, useTransform } from "framer-motion";
import { KeyboardEvent, useRef, useState } from "react";

type Tint = "cool" | "warm" | "neutral";

type Props = {
  src: string;
  className?: string;
  parallax?: [number, number];
  float?: number;
  duration?: number;
  desat?: number;
  tint?: Tint;
  opacity?: number;
  flip?: boolean;
  onClick?: () => void;
  /** Blend mode used to drop the JPG background. Default "screen" lifts dark pixels away. */
  blend?: "screen" | "lighten" | "plus-lighter" | "normal";
};

const tintFilter: Record<Tint, string> = {
  cool: "saturate(0.85) hue-rotate(-8deg)",
  warm: "saturate(0.9) hue-rotate(8deg)",
  neutral: "saturate(0.85)",
};

const tintGlow: Record<Tint, string> = {
  cool: "radial-gradient(60% 50% at 50% 45%, rgba(89,222,191,0.18), transparent 70%)",
  warm: "radial-gradient(60% 50% at 50% 45%, rgba(255,140,90,0.16), transparent 70%)",
  neutral: "radial-gradient(60% 50% at 50% 45%, rgba(169,178,234,0.14), transparent 70%)",
};

export function AmbientFigure({
  src,
  className = "",
  parallax = [-30, 40],
  float = 14,
  duration = 12,
  desat = 0,
  tint = "cool",
  opacity = 0.85,
  flip = false,
  onClick,
  blend = "normal",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallax[0], parallax[1]]);

  const handleClick = () => {
    setActive(true);
    onClick?.();
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);
  const handleFocus = () => setHovered(true);
  const handleBlur = () => setHovered(false);

  const isLit = hovered || active;

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      initial={{ opacity: 0, filter: "blur(16px)" }}
      whileInView={{ opacity, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      className={`absolute z-0 pointer-events-auto cursor-pointer ${className}`}
    >
      {/* glow halo sits BEHIND the image, normal blend so it shows through */}
      <div
        aria-hidden
        className="absolute inset-0 blur-3xl"
        style={{ background: tintGlow[tint] }}
      />
      <motion.div
        animate={{ y: [0, -float, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <img
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          draggable={false}
          className="w-full h-auto select-none"
          style={{
            mixBlendMode: blend,
            transform: flip ? "scaleX(-1)" : undefined,
            filter: `grayscale(${isLit ? 0 : desat}%) ${tintFilter[tint]} contrast(1.05) brightness(${isLit ? 1.12 : 0.94}) drop-shadow(0 30px ${isLit ? 84 : 60}px rgba(0,0,0,0.55))`,
            transition: "filter 300ms ease, transform 300ms ease",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
