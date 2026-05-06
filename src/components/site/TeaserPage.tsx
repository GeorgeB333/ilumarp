import { useState, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import { RevealText, RevealBlock } from "./RevealText";

import charMan from "@/assets/character1man.png";
import charWoman from "@/assets/2character2female.png";
import heroCity from "@/assets/hero-city.jpg";
import cityAerial from "@/assets/city-aerial.jpg";
import duoImage from "@/assets/man-and-woman-together.webp";
import charactersImage from "@/assets/characters.png";
import rageMpImage from "@/assets/ragemp.jpg";
import image111 from "@/assets/image111.jpg";
import ytilumaImage from "@/assets/ytiluma.png";
import ilumaBanner from "@/assets/ilumabanner.png";
import imageBottom from "@/assets/imgaebottom.png";
import imageMid from "@/assets/imagemid.png";
import teaserBg from "@/assets/teaser-bg.png";

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WORD = "RAGE:MP";
const SLOTS = WORD.split("");
const NOISE = "â–ˆâ–“â–’â–‘#@%&*?!+=/\\<>~^";
const TOTAL_CHARS = SLOTS.filter((c) => c !== " " && c !== ":").length;

// â”€â”€ Countdown logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TARGET = Date.now() + 27 * 24 * 60 * 60 * 1000 + 14 * 3600 * 1000;
function getParts(diff: number) {
  const c = Math.max(0, diff);
  return {
    d: Math.floor(c / 86400000),
    h: Math.floor((c / 3600000) % 24),
    m: Math.floor((c / 60000) % 60),
    s: Math.floor((c / 1000) % 60),
  };
}

// â”€â”€ Glyph tile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Glyph({
  char,
  state,
  onClick,
}: {
  char: string;
  state: "locked" | "next" | "revealed";
  onClick: () => void;
}) {
  const [noise, setNoise] = useState(NOISE[0]);

  useEffect(() => {
    if (state === "revealed") return;
    const id = setInterval(
      () => setNoise(NOISE[Math.floor(Math.random() * NOISE.length)]),
      state === "next" ? 60 : 220,
    );
    return () => clearInterval(id);
  }, [state]);

  return (
    <button
      onClick={onClick}
      disabled={state === "locked"}
      aria-label={state === "revealed" ? `Litera ${char}` : "Simbol criptat"}
      className={`glyph-tile group relative flex flex-col items-center justify-center
        h-20 w-14 sm:h-24 sm:w-20 md:h-36 md:w-28 lg:h-40 lg:w-32
        rounded-lg border transition-all duration-300
        ${
          state === "revealed"
            ? "border-primary bg-primary/10 text-primary"
            : state === "next"
              ? "border-primary/50 bg-card/80 cursor-pointer hover:border-primary hover:bg-primary/20 hover:-translate-y-1"
              : "border-border/40 bg-card/40 cursor-not-allowed opacity-50"
        }`}
    >
      {/* Corner brackets for unlocked tiles */}
      {state !== "locked" && (
        <>
          <span className="absolute top-[5px] left-[5px] h-2.5 w-2.5 border-t border-l border-primary/80" />
          <span className="absolute top-[5px] right-[5px] h-2.5 w-2.5 border-t border-r border-primary/80" />
          <span className="absolute bottom-[5px] left-[5px] h-2.5 w-2.5 border-b border-l border-primary/80" />
          <span className="absolute bottom-[5px] right-[5px] h-2.5 w-2.5 border-b border-r border-primary/80" />
        </>
      )}

      {/* Scanline sweep on "next" */}
      {state === "next" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute inset-x-0 h-px bg-primary/50 animate-scan" />
        </span>
      )}

      {/* Glyph character */}
      <AnimatePresence mode="wait">
        {state === "revealed" ? (
          <motion.span
            key="r"
            initial={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gradient"
            style={{ fontWeight: 700 }}
          >
            {char}
          </motion.span>
        ) : (
          <motion.span
            key="n"
            className={`font-mono text-base sm:text-xl md:text-2xl select-none ${
              state === "next" ? "text-primary" : "text-muted-foreground/30"
            }`}
          >
            {noise}
          </motion.span>
        )}
      </AnimatePresence>

      {/* State badge */}
      <span className="absolute -bottom-6 left-0 right-0 text-center font-mono text-[8px] tracking-widest text-muted-foreground/60 uppercase">
        {state === "revealed" ? "DECRIPTAT" : state === "next" ? "[APASÄ‚]" : "BLOCAT"}
      </span>
    </button>
  );
}

// â”€â”€ CountdownUnit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CountdownUnit({ value, label, locked = false }: { value: number; label: string; locked?: boolean }) {
  const display = locked ? "??" : String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div
        className="font-display text-4xl sm:text-5xl md:text-6xl tabular-nums leading-none select-none"
        style={{
          fontWeight: 700,
          color: locked ? "rgba(16, 250, 223, 0.85)" : undefined,
          filter: locked ? "drop-shadow(0 0 10px rgba(16, 250, 223, 0.4))" : undefined,
        }}
      >
        {display}
      </div>
      <div className="mt-2 font-display text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground" style={{ fontWeight: 400 }}>
        {label}
      </div>
    </div>
  );
}

// â”€â”€ Main Teaser Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function TeaserPage() {
  const [revealed, setRevealed] = useState(0);
  const [time, setTime] = useState(() => getParts(TARGET - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setTime(getParts(TARGET - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  const done = revealed >= TOTAL_CHARS;
  const progress = Math.round((revealed / TOTAL_CHARS) * 100);

  let cursor = -1;
  const slots = SLOTS.map((char) => {
    if (char === " " || char === ":") return { char, idx: -1 };
    cursor += 1;
    return { char, idx: cursor };
  });

  return (
    <div className="relative min-h-screen">
      {/* â”€â”€ Full-bleed background â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src={teaserBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-30"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/95" />
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[40rem] w-[80rem] rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      {/* â”€â”€ Page content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 pt-24 sm:pt-32 md:pt-40 pb-16 md:pb-24">

        {/* â”€â”€ Main Heading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 relative"
        >
          {/* Background characters */}
          <div className="absolute -right-32 -top-24 h-[600px] w-full pointer-events-none -z-10 hidden xl:block">
            <div className="relative h-full w-full pointer-events-none">
              {/* Woman */}
              <motion.img
                src={charWoman}
                alt=""
                initial={{ opacity: 0, y: 60, filter: "blur(20px) drop-shadow(0 0 8px rgba(93, 146, 195, 0.16)) drop-shadow(0 0 20px rgba(93, 146, 195, 0.08)) contrast(0.99) brightness(1.01) saturate(1.04)" }}
                animate={{
                  opacity: 0.40,
                  y: 0,
                  filter: "blur(0.55px) drop-shadow(0 0 8px rgba(93, 146, 195, 0.16)) drop-shadow(0 0 20px rgba(93, 146, 195, 0.08)) contrast(0.99) brightness(1.01) saturate(1.04)",
                  scale: [1, 1.015, 1],
                  rotate: [-0.8, 0.8, -0.8],
                }}
                whileHover={{
                  scale: 1.03,
                  opacity: 0.56,
                  filter: "drop-shadow(0 0 28px rgba(93, 146, 195, 0.42)) drop-shadow(0 0 54px rgba(93, 146, 195, 0.2)) brightness(1.12) saturate(1.16)",
                }}
                transition={{
                  opacity: { duration: 1.1, delay: 0.9 },
                  y: { duration: 1.3, delay: 0.9, ease: [0.22, 1, 0.36, 1] },
                  filter: { duration: 1.1, delay: 0.9 },
                  scale: { duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 2.2 },
                  rotate: { duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 2.2 },
                }}
                className="absolute right-56 top-10 h-[95%] w-auto object-contain pointer-events-auto z-10"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.92) 12%, black 26%, black 68%, rgba(0,0,0,0.88) 84%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.9) 9%, black 24%, black 76%, rgba(0,0,0,0.9) 91%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.92) 12%, black 26%, black 68%, rgba(0,0,0,0.88) 84%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.9) 9%, black 24%, black 76%, rgba(0,0,0,0.9) 91%, transparent 100%)",
                }}
              />
              {/* Man */}
              <motion.img
                src={charMan}
                alt=""
                initial={{ opacity: 0, y: 60, filter: "blur(20px) drop-shadow(0 0 8px rgba(89, 222, 191, 0.16)) drop-shadow(0 0 20px rgba(89, 222, 191, 0.08)) contrast(0.99) brightness(1.01) saturate(1.04)" }}
                animate={{
                  opacity: 0.40,
                  y: 0,
                  filter: "blur(0.55px) drop-shadow(0 0 8px rgba(89, 222, 191, 0.16)) drop-shadow(0 0 20px rgba(89, 222, 191, 0.08)) contrast(0.99) brightness(1.01) saturate(1.04)",
                  scale: [1, 1.02, 1],
                  rotate: [0.8, -0.8, 0.8],
                }}
                whileHover={{
                  scale: 1.03,
                  opacity: 0.56,
                  filter: "drop-shadow(0 0 28px rgba(89, 222, 191, 0.42)) drop-shadow(0 0 54px rgba(89, 222, 191, 0.2)) brightness(1.12) saturate(1.16)",
                }}
                transition={{
                  opacity: { duration: 1.1, delay: 1.1 },
                  y: { duration: 1.3, delay: 1.1, ease: [0.22, 1, 0.36, 1] },
                  filter: { duration: 1.1, delay: 1.1 },
                  scale: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 2.4 },
                  rotate: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 2.4 },
                }}
                className="absolute right-0 top-0 h-[100%] w-auto object-contain pointer-events-auto z-20"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.92) 12%, black 26%, black 68%, rgba(0,0,0,0.88) 84%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.9) 9%, black 24%, black 76%, rgba(0,0,0,0.9) 91%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.92) 12%, black 26%, black 68%, rgba(0,0,0,0.88) 84%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.9) 9%, black 24%, black 76%, rgba(0,0,0,0.9) 91%, transparent 100%)",
                }}
              />
            </div>
          </div>

          <h1 className="display-tight text-[13vw] md:text-[9vw] lg:text-[8rem] xl:text-[9rem] leading-[0.88] max-w-[12ch]">
            <RevealText as="span" className="block" immediate delay={0.25} stagger={0.07}>
              Esti gata
            </RevealText>
            <RevealText as="span" className="block" immediate delay={0.45} stagger={0.07}>
              sa descoperi
            </RevealText>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: "0.4em", filter: "blur(10px)" }}
              animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              proiectul <span className="text-gradient">ILUMA?</span>
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="font-display text-base sm:text-xl md:text-2xl text-muted-foreground max-w-xl leading-snug mb-6 sm:mb-8 md:mb-12"
        >
          Decripteaza cuvintele de mai jos pentru a afla platforma pe care va fi lansat serverul si pregateste-te pentru primul contact cu orasul{" "}
          <span className="text-gradient">ILUMA</span>.
        </motion.p>

        {/* â”€â”€ Cipher Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.section
          id="cipher"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="relative"
        >
          {/* Terminal panel header */}
          <RevealBlock className="mb-4 md:mb-8" amount={0.4}>
            <div>
              <div className="micro-label flex items-center gap-3 mb-4 text-primary uppercase">
                <RevealText splitBy="char" stagger={0.02} duration={0.6}>
                  INSTRUCTIUNI DE DECRIPTARE
                </RevealText>
              </div>
              <RevealText
                as="p"
                stagger={0.02}
                duration={0.7}
                delay={0.15}
                className="font-display text-sm sm:text-base md:text-lg text-muted-foreground max-w-sm"
              >
                Apasa pe fiecare element disponibil in ordine pentru a decripta cuvantul si a afla platforma serverului.
              </RevealText>
            </div>
          </RevealBlock>

          {/* â”€â”€ Glyph grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-8 py-8 md:py-12">
            {slots.map((slot, i) => {
              if (slot.char === " ")
                return <div key={i} className="w-3 sm:w-6 md:w-12" />;
              if (slot.char === ":")
                return (
                  <div
                    key={i}
                    className="flex h-20 w-4 select-none items-center justify-center sm:h-24 sm:w-6 md:h-36 md:w-8 lg:h-40 lg:w-10"
                  >
                    <span className="font-display text-3xl text-primary/85 sm:text-4xl md:text-5xl lg:text-6xl">:</span>
                  </div>
                );
              const state =
                slot.idx < revealed
                  ? "revealed"
                  : slot.idx === revealed
                    ? "next"
                    : "locked";
              return (
                <Glyph
                  key={i}
                  char={slot.char}
                  state={state}
                  onClick={() => state === "next" && setRevealed((r) => r + 1)}
                />
              );
            })}
          </div>

          {/* â”€â”€ Reveal outcome â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative mt-16 md:mt-24 w-full"
              >
                <div className="pointer-events-none absolute -left-[210px] top-[-270px] z-20 hidden h-[840px] w-[360px] xl:block">
                  <motion.img
                    src={imageMid}
                    alt=""
                    aria-hidden="true"
                    initial={{ opacity: 0, y: 60, filter: "blur(20px) drop-shadow(0 0 8px rgba(89, 222, 191, 0.15)) contrast(0.99) brightness(1.01) saturate(1.04)" }}
                    animate={{
                      opacity: 0.38,
                      y: 0,
                      filter: "blur(0.6px) drop-shadow(0 0 8px rgba(89, 222, 191, 0.15)) drop-shadow(0 0 20px rgba(89, 222, 191, 0.08)) contrast(0.99) brightness(1.01) saturate(1.04)",
                      scale: [1, 1.016, 1],
                      rotate: [-0.8, 0.8, -0.8],
                    }}
                    whileHover={{
                      scale: 1.04,
                      opacity: 0.56,
                      filter: "drop-shadow(0 0 20px rgba(89, 222, 191, 0.3)) drop-shadow(0 0 46px rgba(89, 222, 191, 0.18)) brightness(1.11) saturate(1.14)",
                    }}
                    transition={{
                      opacity: { duration: 1.1, delay: 0.5 },
                      y: { duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
                      filter: { duration: 1.1, delay: 0.5 },
                      scale: { duration: 4.3, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
                      rotate: { duration: 4.3, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
                    }}
                    className="pointer-events-auto h-full w-full object-contain object-bottom"
                    style={{
                      maskImage:
                        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 10%, black 24%, black 70%, rgba(0,0,0,0.86) 84%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.86) 10%, black 24%, black 76%, rgba(0,0,0,0.86) 90%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 10%, black 24%, black 70%, rgba(0,0,0,0.86) 84%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.86) 10%, black 24%, black 76%, rgba(0,0,0,0.86) 90%, transparent 100%)",
                    }}
                  />
                </div>
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.9 }}
                  className="mx-auto mb-12 md:mb-20 max-w-[1080px] rounded-2xl md:rounded-[2rem] border border-border/50 bg-card/25 p-5 sm:p-8 backdrop-blur-xl md:p-10"
                >
                  <div className="grid gap-6 md:gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4 flex items-center justify-center lg:justify-start">
                      <h3
                        className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground md:text-4xl text-center lg:text-left"
                        style={{
                          textShadow: "0 0 18px rgba(16, 250, 223, 0.05)",
                        }}
                      >
                        <span className="bg-gradient-to-b from-white/92 via-white/86 to-white/58 bg-clip-text text-transparent">
                          ILUMA
                        </span>{" "}
                        <span
                          className="bg-gradient-to-b from-[#b8fff0]/80 via-[#10FADF]/88 to-[#65ffe5]/72 bg-clip-text text-transparent"
                          style={{
                            filter: "drop-shadow(0 0 8px rgba(16, 250, 223, 0.1))",
                          }}
                        >
                          RAGE:MP
                        </span>
                      </h3>
                    </div>
                    <RevealBlock className="space-y-4 md:space-y-5 lg:col-span-8" amount={0.2} delay={0.15}>
                      <p className="text-sm sm:text-base leading-relaxed text-foreground/88">
                        <span className="text-gradient">ILUMA</span> Roleplay este construit ca o experiență cinematografică de oraș viu, iar mutarea pe
                        <span className="text-primary"> RAGE Multiplayer</span> înseamnă mai multă stabilitate, sisteme moderne
                        și mai mult spațiu pentru povești care chiar contează.
                      </p>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                        De aproape un an, echipa noastră dezvoltă un gamemode unic, creat pentru a aduce ceva nou comunității
                        de roleplay din România. Accentul este pus pe realism, progres autentic și o comunitate matură, unde
                        fiecare alegere și fiecare oră petrecută pe server au valoare.
                      </p>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                        Tot ce vezi aici este doar începutul: economie persistentă, interacțiuni gândite pentru roleplay
                        serios și un univers pregătit să crească în jurul jucătorilor.{" "}
                        <a
                          href="https://discord.gg/iluma"
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                        >
                          Urmărește Discord-ul
                        </a>{" "}
                        pentru a afla data deschiderii serverului.
                      </p>
                    </RevealBlock>
                  </div>
                </motion.section>
                <HowToPlay />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.9 }}
                  className="mt-16 md:mt-32 border-t border-border/50 pt-8 md:pt-10"
                >
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center text-center">
                      <div className="font-display text-xs sm:text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4 md:mb-6 px-4" style={{ fontWeight: 400 }}>
                        Timp de așteptare până la deschiderea serverului
                      </div>
                      <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-10">
                        <CountdownUnit value={time.d} label="Zile" locked />
                        <span className="font-display text-2xl sm:text-3xl text-primary/30 pb-4 sm:pb-5">/</span>
                        <CountdownUnit value={time.h} label="Ore" />
                        <span className="font-display text-2xl sm:text-3xl text-primary/30 pb-4 sm:pb-5">/</span>
                        <CountdownUnit value={time.m} label="Minute" />
                        <span className="font-display text-2xl sm:text-3xl text-primary/30 pb-4 sm:pb-5">/</span>
                        <CountdownUnit value={time.s} label="Secunde" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <footer className="mt-20 pt-8 border-t border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="font-sans text-xs text-muted-foreground">
            © 2026 ILumaDesign. All Right Reserved
          </div>
        </footer>
      </div>
    </div>
  );
}

// How to play section revealed after decryption
function HowToPlay() {
  const steps = [
    {
      step: "Pasul 01",
      title: "Cumpara GTA 5",
      text: "Cumpara si instaleaza Grand Theft Auto V pe PC prin Steam, Epic Games sau Rockstar Launcher.",
      color: "67, 111, 160",
      image: image111,
      layoutClassName: "lg:col-span-7 lg:row-span-1",
      height: "320px",
      size: "wide" as const,
      kicker: "Primul pas",
      href: "https://store.rockstargames.com/game/buy-gta-v",
    },
    {
      step: "Pasul 02",
      title: "Descarca Rage:MP",
      text: "Descarca Rage Multiplayer de pe site-ul oficial si completeaza instalarea pe PC.",
      color: "34, 113, 122",
      image: rageMpImage,
      layoutClassName: "lg:col-span-3 lg:row-span-1",
      height: "238px",
      size: "compact" as const,
      kicker: "Launcher",
      href: "https://rage.mp/",
    },
    {
      step: "Pasul 03",
      title: "Conecteaza-te",
      text: "Porneste Rage:MP, cauta Los Santos Echoes in lista si alatura-te serverului.",
      color: "121, 86, 154",
      image: ilumaBanner,
      layoutClassName: "lg:col-span-4 lg:row-span-1",
      height: "238px",
      size: "compact" as const,
      kicker: "Server",
      href: undefined,
    },
    {
      step: "Pasul 04",
      title: "Ghid Video",
      text: "Verifica videoclipul nostru de pe YouTube pentru instructiuni detaliate.",
      color: "165, 95, 73",
      image: ytilumaImage,
      layoutClassName: "lg:col-span-5 lg:row-span-2",
      height: "560px",
      size: "tall" as const,
      kicker: "Ajutor rapid",
      href: "https://www.youtube.com/@ILumaRoRP",
      imageClassName: undefined,
    },
  ];

  return (
    <div className="relative w-full max-w-[1280px] mx-auto mt-12 md:mt-20 px-2 sm:px-4">
      <div className="absolute right-[-60px] top-12 z-20 hidden h-[940px] w-[400px] xl:block pointer-events-none">
        <motion.img
          src={imageBottom}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, y: 60, filter: "blur(20px) drop-shadow(0 0 8px rgba(89, 222, 191, 0.15)) contrast(0.99) brightness(1.01) saturate(1.04)" }}
          whileInView={{
            opacity: 0.42,
            y: 0,
            filter: "blur(0.6px) drop-shadow(0 0 8px rgba(89, 222, 191, 0.15)) drop-shadow(0 0 20px rgba(89, 222, 191, 0.08)) contrast(0.99) brightness(1.01) saturate(1.04)",
            scale: [1, 1.018, 1],
            rotate: [0.8, -0.8, 0.8],
          }}
          viewport={{ once: true, amount: 0.15 }}
          whileHover={{
            scale: 1.045,
            opacity: 0.54,
            filter: "drop-shadow(0 0 20px rgba(89, 222, 191, 0.3)) drop-shadow(0 0 46px rgba(89, 222, 191, 0.18)) brightness(1.11) saturate(1.14)",
          }}
          transition={{
            opacity: { duration: 1.1, delay: 0.3 },
            y: { duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
            filter: { duration: 1.1, delay: 0.3 },
            scale: { duration: 4.1, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
            rotate: { duration: 4.1, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
          }}
          className="pointer-events-auto h-full w-full object-contain object-bottom"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 10%, black 24%, black 70%, rgba(0,0,0,0.86) 84%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.86) 10%, black 24%, black 76%, rgba(0,0,0,0.86) 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 10%, black 24%, black 70%, rgba(0,0,0,0.86) 84%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.86) 10%, black 24%, black 76%, rgba(0,0,0,0.86) 90%, transparent 100%)",
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <RevealText className="micro-label mb-3 block" splitBy="char" stagger={0.02} duration={0.6}>
            Ghid De Pornire
          </RevealText>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold uppercase tracking-tight text-foreground">
            Cum vei putea intra pe{" "}
            <span className="text-gradient">ILUMA</span>
          </h2>
          <RevealText
            as="p"
            stagger={0.02}
            duration={0.7}
            delay={0.25}
            className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base"
          >
            Tot ce ai nevoie pentru a intra rapid pe server. Pregateste-te fara pasi inutili si fara blocaje la instalare.
          </RevealText>
        </div>
      </motion.div>

      <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(240px,auto)]">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={step.layoutClassName}
          >
            <InteractiveCard
              step={step.step}
              title={step.title}
              text={step.text}
              color={step.color}
              image={step.image}
              height={step.height}
              size={step.size}
              kicker={step.kicker}
              href={step.href}
              imageClassName={step.imageClassName}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InteractiveCard({
  step,
  title,
  text,
  color,
  image,
  height,
  size,
  kicker,
  href,
  imageClassName,
}: {
  step: string;
  title: string;
  text: string;
  color: string;
  image: string;
  height: string;
  size: "wide" | "compact" | "tall";
  kicker: string;
  href?: string;
  imageClassName?: string;
}) {
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 10;

    target.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
    target.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
    target.style.setProperty("--pointer-x", `${((x / rect.width) * 100).toFixed(2)}%`);
    target.style.setProperty("--pointer-y", `${((y / rect.height) * 100).toFixed(2)}%`);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    target.style.setProperty("--rotate-x", "0deg");
    target.style.setProperty("--rotate-y", "0deg");
    target.style.setProperty("--pointer-x", "50%");
    target.style.setProperty("--pointer-y", "50%");
  };

  return (
    <div
      className={`parent parent--${size}`}
      style={{ "--card-color": color, "--card-height": height } as any}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noreferrer" : undefined}
        className={`card ${href ? "card--interactive" : ""}`}
      >
        <div className="media">
          <img src={image} alt={title} className={`media-image ${imageClassName ?? ""}`.trim()} />
          <div className="media-overlay" />
        </div>
        <div className="content">
          <div className="card-topline">
            <span className="card-kicker">{kicker}</span>
            <span className="title-step">{step}</span>
          </div>
          <div className="title-row">
            <span className="title tracking-tighter">{title}</span>
          </div>
          <span className="text">{text}</span>
        </div>
      </a>
      <style>{cardStyles}</style>
    </div>
  );
}

const cardStyles = `
  .parent {
    width: 100%;
    height: var(--card-height, 380px);
    min-height: 238px;
    perspective: 1400px;
    --rotate-x: 0deg;
    --rotate-y: 0deg;
    --pointer-x: 50%;
    --pointer-y: 50%;
  }

  @media (max-width: 767px) {
    .parent { height: auto; min-height: 260px; }
    .parent--wide { min-height: 280px; }
    .parent--compact { min-height: 220px; }
    .parent--tall { min-height: 380px; }
    .parent--tall .media { height: 220px; }
    .parent--tall .content { padding-top: 232px; }
    .parent--wide .media { height: 158px; }
    .parent--wide .content { padding-top: 172px; }
    .parent--compact .media { height: 118px; }
    .parent--compact .content { padding-top: 132px; }
  }

  .card {
    display: block;
    height: 100%;
    border-radius: 22px;
    overflow: hidden;
    background:
      radial-gradient(circle at top right, rgba(var(--card-color), 0.1), transparent 38%),
      linear-gradient(180deg, rgba(10, 14, 24, 0.48) 0%, rgba(8, 11, 19, 0.28) 100%);
    border: 1px solid rgba(255, 255, 255, 0.035);
    transition: transform 0.18s ease-out, box-shadow 0.25s ease, border-color 0.25s ease;
    transform-style: preserve-3d;
    transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 18px 30px -24px,
      rgba(var(--card-color), 0.06) 0px 10px 20px -24px;
    position: relative;
    text-decoration: none;
    backdrop-filter: blur(10px);
  }

  .card--interactive {
    cursor: pointer;
  }

  .card::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(255,255,255,0.14), transparent 26%),
      linear-gradient(180deg, rgba(255,255,255,0.03), transparent 20%, transparent 80%, rgba(255,255,255,0.04));
    pointer-events: none;
  }

  .media {
    position: absolute;
    inset: 10px 10px auto 10px;
    height: 176px;
    border-radius: 16px;
    overflow: hidden;
    transform: translate3d(0, 0, 34px);
    border: 1px solid rgba(255, 255, 255, 0.045);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
  }

  .media-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 28%;
    transform-origin: center center;
    display: block;
    filter: saturate(1.05) contrast(1.04) brightness(0.72);
    transition: transform 0.18s ease-out, filter 0.25s ease;
  }

  .media-image--contain {
    object-fit: contain;
    object-position: center center;
    background: linear-gradient(180deg, rgba(10, 14, 24, 0.3), rgba(10, 14, 24, 0.5));
    padding: 12px;
  }

  .media-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(4, 7, 14, 0.06) 0%, rgba(4, 7, 14, 0.2) 36%, rgba(4, 7, 14, 0.84) 100%),
      linear-gradient(135deg, rgba(var(--card-color), 0.18), transparent 60%);
  }

  .content {
    padding: 202px 18px 18px 18px;
    position: relative;
    z-index: 2;
    display: flex;
    min-height: 100%;
    flex-direction: column;
    transform: translate3d(0, 0, 44px);
    transition: transform 0.18s ease-out;
  }

  .card-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }

  .card-kicker {
    color: rgba(225, 233, 245, 0.72);
    font-size: 10px;
    font-family: var(--font-mono);
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .title-row {
    display: block;
  }

  .content .title {
    display: block;
    color: rgba(255, 255, 255, 0.99);
    font-weight: 800;
    font-size: 24px;
    line-height: 0.98;
    font-family: var(--font-display);
    text-shadow: 0 2px 18px rgba(0, 0, 0, 0.45);
  }

  .title-step {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.9);
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .content .text {
    display: block;
    color: rgba(229, 236, 248, 0.78);
    font-size: 13px;
    line-height: 1.55;
    margin-top: 10px;
    max-width: 34ch;
  }

  .parent--wide .media {
    height: 182px;
  }

  .parent--wide .content {
    padding-top: 196px;
  }

  .parent--compact .media {
    height: 118px;
  }

  .parent--compact .content {
    padding: 132px 15px 15px 15px;
  }

  .parent--compact .content .title {
    font-size: 19px;
  }

  .parent--compact .card-topline {
    margin-bottom: 8px;
  }

  .parent--compact .content .text {
    font-size: 11px;
    line-height: 1.4;
    margin-top: 6px;
  }

  .parent--tall .media {
    height: 404px;
  }

  .parent--tall .content {
    padding-top: 418px;
  }

  .parent--tall .content .title {
    font-size: 28px;
  }

  .parent--tall .content .text {
    font-size: 13px;
    max-width: 38ch;
  }

  .parent:hover .card {
    border-color: rgba(255, 255, 255, 0.06);
    box-shadow:
      rgba(0, 0, 0, 0.26) 0px 24px 38px -24px,
      rgba(var(--card-color), 0.1) 0px 16px 28px -24px;
  }

  .parent:hover .media-image {
    transform: scale(1.09) translateZ(0);
    filter: saturate(1.1) contrast(1.06) brightness(0.78);
  }

  .parent:hover .media {
    transform: translate3d(0, 0, 60px);
  }

  .parent:hover .content {
    transform: translate3d(0, 0, 72px);
  }
`;
