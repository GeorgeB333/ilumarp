import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "@/assets/logo.png";

type Phase = "boot" | "resolve" | "exit" | "done";

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("boot");

  const stableComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    const t = (ms: number, fn: () => void) => setTimeout(fn, ms);
    const timers = [
      t(250, () => setPhase("resolve")),
      t(2600, () => setPhase("exit")),
      t(3500, () => {
        setPhase("done");
        stableComplete();
      }),
    ];
    return () => timers.forEach(clearTimeout);
  }, [stableComplete]);

  const smoothOut: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
  const glow =
    "drop-shadow(0 0 24px rgba(89, 222, 191, 0.22)) drop-shadow(0 0 48px rgba(89, 222, 191, 0.08))";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#05080a]"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: smoothOut }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="grain absolute inset-0 opacity-[0.03] mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
          </div>

          <motion.div
            className="relative z-10"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{
              scale: phase === "exit" ? 1.06 : 1,
              opacity: phase === "boot" ? 0 : 1,
            }}
            transition={{
              duration: phase === "exit" ? 1.0 : 1.6,
              ease: smoothOut,
            }}
          >
            <div className="relative h-36 w-36 md:h-44 md:w-44">
              <motion.img
                src={logoSrc}
                alt="ILUMA"
                className="h-full w-full object-contain"
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  filter: `${glow} brightness(0.35) blur(8px)`,
                }}
                animate={{
                  opacity: phase === "boot" ? 0 : 1,
                  scale: phase === "boot" ? 0.94 : 1,
                  filter:
                    phase === "exit"
                      ? `${glow} brightness(1.08) blur(4px)`
                      : phase === "resolve"
                        ? `${glow} brightness(1.08) blur(0px)`
                        : `${glow} brightness(0.35) blur(8px)`,
                }}
                transition={{ duration: 1.5, delay: 0.1, ease: smoothOut }}
              />

              {phase === "resolve" && (
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    mixBlendMode: "plus-lighter",
                    WebkitMaskImage: `url(${logoSrc})`,
                    maskImage: `url(${logoSrc})`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/14 to-transparent"
                    animate={{ translateX: ["-100%", "200%"] }}
                    transition={{ duration: 1.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transform: "skewX(-25deg)" }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
