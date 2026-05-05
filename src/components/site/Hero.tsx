import { motion, useScroll, useTransform, useAnimationControls } from "framer-motion";
import { useRef } from "react";
import heroCity from "@/assets/hero-city.jpg";
import logoSrc from "@/assets/logo.png";
import charMan from "@/assets/character1man.png";
import charWoman from "@/assets/2character2female.png";
import { Countdown } from "./Countdown";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yCharacters = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const womanControls = useAnimationControls();
  const manControls = useAnimationControls();
  const womanGlowBase =
    "drop-shadow(0 0 35px rgba(93, 146, 195, 0.45)) brightness(1) saturate(1) contrast(1)";
  const womanGlowBurst =
    "drop-shadow(0 0 35px rgba(93, 146, 195, 0.45)) brightness(1.45) saturate(1.7) contrast(1.08)";
  const manGlowBase =
    "drop-shadow(0 0 35px rgba(89, 222, 191, 0.45)) brightness(1) saturate(1) contrast(1)";
  const manGlowBurst =
    "drop-shadow(0 0 35px rgba(89, 222, 191, 0.45)) brightness(1.45) saturate(1.7) contrast(1.08)";

  const pulseSequence = (
    controls: ReturnType<typeof useAnimationControls>,
    burst: string,
    base: string,
  ) =>
    controls.start({
      scale: [1, 1.08, 1],
      filter: [base, burst, base],
      transition: { duration: 1.1, times: [0, 0.35, 1], ease: [0.22, 0.61, 0.36, 1] },
    });

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden grain">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroCity}
          alt="Cinematic city at night"
          width={1920}
          height={1088}
          className="h-[120%] w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/60" />
      </motion.div>

      {/* Characters Layer */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 z-[5] flex items-end justify-end overflow-hidden px-4 md:px-20 pointer-events-none"
      >
        <div className="relative h-full w-full max-w-[1400px] flex justify-end items-end pointer-events-none">
          {/* Woman */}
          <motion.div
            style={{ y: yCharacters }}
            animate={{
              scale: [1, 1.05, 1.02, 1.06, 1],
              translateY: [0, -32, -14, -38, 0],
              translateX: [0, 14, -8, 12, 0],
              rotate: [0, 1.8, -1, 2.2, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
              times: [0, 0.28, 0.55, 0.78, 1],
            }}
            className="absolute right-56 md:right-80 bottom-0 h-[80%] md:h-[92%] z-[10] pointer-events-auto cursor-pointer will-change-transform"
            onClick={() => pulseSequence(womanControls, womanGlowBurst, womanGlowBase)}
          >
            <motion.img
              src={charWoman}
              alt="Character Female"
              animate={womanControls}
              initial={{ scale: 1, filter: womanGlowBase }}
              whileHover={{
                scale: 1.05,
                filter:
                  "drop-shadow(0 0 50px rgba(93, 146, 195, 0.7)) brightness(1.2) saturate(1.4)",
                transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
              }}
              whileTap={{
                scale: 0.97,
                transition: { duration: 0.18, ease: [0.22, 0.61, 0.36, 1] },
              }}
              className="h-full w-auto object-contain"
            />
          </motion.div>

          {/* Man */}
          <motion.div
            style={{ y: yCharacters }}
            animate={{
              scale: [1, 1.06, 1.025, 1.07, 1],
              translateY: [0, -42, -18, -46, 0],
              translateX: [0, -16, 9, -14, 0],
              rotate: [0, -2, 1.2, -2.4, 0],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
              times: [0, 0.25, 0.55, 0.8, 1],
              delay: 0.7,
            }}
            className="absolute -right-20 md:right-0 bottom-0 h-[85%] md:h-[95%] z-[20] pointer-events-auto cursor-pointer will-change-transform"
            onClick={() => pulseSequence(manControls, manGlowBurst, manGlowBase)}
          >
            <motion.img
              src={charMan}
              alt="Character Male"
              animate={manControls}
              initial={{ scale: 1, filter: manGlowBase }}
              whileHover={{
                scale: 1.05,
                filter:
                  "drop-shadow(0 0 50px rgba(89, 222, 191, 0.7)) brightness(1.2) saturate(1.4)",
                transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
              }}
              whileTap={{
                scale: 0.97,
                transition: { duration: 0.18, ease: [0.22, 0.61, 0.36, 1] },
              }}
              className="h-full w-auto object-contain"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle scanlines */}
      <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />

      {/* Watermark logo behind, offset right */}
      <div className="pointer-events-none absolute -right-32 top-1/4 hidden lg:block opacity-20">
        <img
          src={logoSrc}
          alt=""
          aria-hidden="true"
          className="h-[34rem] w-[34rem] object-contain opacity-[0.07]"
        />
      </div>

      {/* Content — left aligned, NOT centered */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 md:px-10 pt-32 pb-24"
      >
        {/* Massive headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="display-tight max-w-[14ch] text-[16vw] md:text-[11vw] lg:text-[9rem] xl:text-[11rem]"
          style={{ fontFamily: "\"Unbounded\", var(--font-display)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9 }}
        >
          Orașul <br />
          nu se <span className="text-stroke italic font-medium">deschide.</span>
          <br />
          Se <span className="text-gradient">cucerește.</span>
        </motion.h1>

        {/* Subline + CTAs in asymmetric row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <p className="lg:col-span-5 text-base md:text-[17px] text-muted-foreground leading-relaxed max-w-md">
            Rage MP. Whitelisted. Persistent.
            <span className="text-foreground"> Singurul lucru scriptat este vremea.</span>
          </p>

          <div className="lg:col-span-4 lg:col-start-8 flex flex-col sm:flex-row gap-3">
            <a
              href="https://discord.com/invite/iluma"
              target="_blank"
              rel="noreferrer"
              className="group relative p-4 rounded-2xl backdrop-blur-xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 via-black/60 to-black/80 shadow-2xl hover:shadow-indigo-500/30 hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer hover:border-indigo-400/60 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-indigo-400/20 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/30 to-indigo-600/10 backdrop-blur-sm group-hover:from-indigo-400/40 group-hover:to-indigo-500/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-7 h-7 fill-current text-indigo-400 group-hover:text-indigo-300 transition-all duration-300 group-hover:scale-110 drop-shadow-lg">
                    <path d="M524.531 69.836a1.5 1.5 0 0 0-.764-.7A485.065 485.065 0 0 0 404.081 32.03a1.816 1.816 0 0 0-1.923.91 337.461 337.461 0 0 0-14.9 30.6 447.848 447.848 0 0 0-134.426 0 309.541 309.541 0 0 0-15.135-30.6 1.89 1.89 0 0 0-1.924-.91 483.689 483.689 0 0 0-119.688 37.107 1.712 1.712 0 0 0-.788.676C39.068 183.651 18.186 294.69 28.43 404.354a2.016 2.016 0 0 0 .765 1.375 487.666 487.666 0 0 0 146.825 74.189 1.9 1.9 0 0 0 2.063-.676A348.2 348.2 0 0 0 208.12 430.4a1.86 1.86 0 0 0-1.019-2.588 321.173 321.173 0 0 1-45.868-21.853 1.885 1.885 0 0 1-.185-3.126 251.047 251.047 0 0 0 9.109-7.137 1.819 1.819 0 0 1 1.9-.256c96.229 43.917 200.41 43.917 295.5 0a1.812 1.812 0 0 1 1.924.233 234.533 234.533 0 0 0 9.132 7.16 1.884 1.884 0 0 1-.162 3.126 301.407 301.407 0 0 1-45.89 21.83 1.875 1.875 0 0 0-1 2.611 391.055 391.055 0 0 0 30.014 48.815 1.864 1.864 0 0 0 2.063.7A486.048 486.048 0 0 0 610.7 405.729a1.882 1.882 0 0 0 .765-1.352c12.264-126.783-20.532-236.912-86.934-334.541zM222.491 337.58c-28.972 0-52.844-26.587-52.844-59.239s23.409-59.241 52.844-59.241c29.665 0 53.306 26.82 52.843 59.239 0 32.654-23.41 59.241-52.843 59.241zm195.38 0c-28.971 0-52.843-26.587-52.843-59.239s23.409-59.241 52.843-59.241c29.667 0 53.307 26.820 52.844 59.239 0 32.654-23.177 59.241-52.844 59.241z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-indigo-400 font-bold text-lg group-hover:text-indigo-300 transition-colors duration-300 drop-shadow-sm">Discord</p>
                  <p className="text-indigo-300/60 text-sm group-hover:text-indigo-200/80 transition-colors duration-300">Alătură-te comunității</p>
                </div>
                <div className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" className="w-5 h-5 text-indigo-400">
                    <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </a>
            <a href="#manifest" className="btn-cine btn-cine--ghost">
              <span>Citește Manifestul</span>
              <span className="btn-arrow">↘</span>
            </a>
          </div>
        </motion.div>

        {/* Bottom strip — countdown + meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9 }}
          className="mt-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-t border-border pt-8"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">
              [ Ușile se deschid în ]
            </div>
            <Countdown />
          </div>

          <div className="flex flex-col gap-2 text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Status
            </div>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="h-2 w-2 bg-primary animate-blink" />
              <span className="text-foreground">Whitelist · Recrutăm</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
