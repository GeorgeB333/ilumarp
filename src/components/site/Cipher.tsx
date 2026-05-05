import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORD = "RAGE MP";
const SLOTS = WORD.split("");
const NOISE = "█▓▒░#@%&*?!+=/\\<>";

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
    const id = setInterval(() => {
      setNoise(NOISE[Math.floor(Math.random() * NOISE.length)]);
    }, state === "next" ? 80 : 200);
    return () => clearInterval(id);
  }, [state]);

  return (
    <button
      onClick={onClick}
      disabled={state === "locked"}
      className={`group relative h-24 w-20 md:h-32 md:w-28 rounded-[10px] border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        state === "revealed"
          ? "border-primary/70 bg-primary/[0.06] shadow-[0_0_40px_-15px_rgb(89_222_191_/_0.4)]"
          : state === "next"
          ? "border-primary/40 bg-card/40 cursor-pointer hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5"
          : "border-border bg-card/20 cursor-not-allowed opacity-70"
      }`}
      aria-label={state === "revealed" ? `Letter ${char}` : "Encrypted glyph"}
    >
      {/* Corner brackets when next/revealed */}
      {state !== "locked" && (
        <>
          <span className="absolute top-1 left-1 h-2 w-2 border-t border-l border-primary" />
          <span className="absolute top-1 right-1 h-2 w-2 border-t border-r border-primary" />
          <span className="absolute bottom-1 left-1 h-2 w-2 border-b border-l border-primary" />
          <span className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-primary" />
        </>
      )}

      {/* scanline sweep on next */}
      {state === "next" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute inset-x-0 h-px bg-primary/60 animate-scan" />
        </span>
      )}

      <AnimatePresence mode="wait">
        {state === "revealed" ? (
          <motion.span
            key="r"
            initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl md:text-5xl text-gradient"
            style={{ fontWeight: 700 }}
          >
            {char}
          </motion.span>
        ) : (
          <span
            className={`font-mono text-xl md:text-2xl ${
              state === "next" ? "text-primary" : "text-muted-foreground/40"
            }`}
          >
            {noise}
          </span>
        )}
      </AnimatePresence>

      {/* Index badge */}
      <span className="absolute -bottom-6 left-0 font-mono text-[9px] tracking-widest text-muted-foreground">
        {state === "revealed" ? "DECRYPTED" : state === "next" ? "[TAP]" : "LOCKED"}
      </span>
    </button>
  );
}

export function Cipher() {
  const [revealed, setRevealed] = useState(0);
  const total = SLOTS.filter((c) => c !== " ").length;
  const done = revealed >= total;

  let cursor = -1;
  const slots = SLOTS.map((char) => {
    if (char === " ") return { char, idx: -1 };
    cursor += 1;
    return { char, idx: cursor };
  });

  const progress = Math.round((revealed / total) * 100);

  return (
    <section id="cipher" className="relative py-32 md:py-44 px-6 md:px-10 overflow-hidden">
      {/* Layered atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[50rem] w-[50rem] rounded-full bg-accent/[0.06] blur-3xl" />
        <div className="absolute inset-0 scanlines opacity-30" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Header — terminal style */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-xs text-primary tracking-tight">03</span>
              <span className="h-px w-12 bg-border" />
            </div>
            <h2 className="display-tight text-5xl md:text-7xl">
              Only those <br />
              who understand <br />
              the <span className="text-gradient">system</span> enter.
            </h2>
          </div>

          {/* Terminal panel */}
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-12">
            <div className="font-mono text-[11px] text-muted-foreground space-y-2 rounded-xl border border-border/80 p-5 bg-card/40 backdrop-blur-md">
              <div className="flex justify-between">
                <span className="text-primary">$ decrypt --signal</span>
                <span className="animate-blink text-primary">_</span>
              </div>
              <div>› channel: <span className="text-foreground">a7-x · 144.7mhz</span></div>
              <div>› payload: <span className="text-foreground">{total} glyphs</span></div>
              <div>› protocol: <span className="text-foreground">manual entry</span></div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between mb-2">
                  <span>progress</span>
                  <span className="text-primary">{progress}%</span>
                </div>
                <div className="h-1 bg-border overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glyph grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12">
          {slots.map((slot, i) => {
            if (slot.char === " ") return <div key={i} className="w-4 md:w-8" />;
            const state =
              slot.idx < revealed ? "revealed" : slot.idx === revealed ? "next" : "locked";
            return (
              <Glyph
                key={i}
                char={slot.char}
                state={state}
                onClick={() => state === "next" && setRevealed(revealed + 1)}
              />
            );
          })}
        </div>

        {/* Outcome */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-20 mx-auto max-w-xl text-center border-t border-primary/40 pt-10"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary mb-4">
                › Signal acquired
              </div>
              <p className="text-muted-foreground italic text-lg">
                "Welcome to the frequency. The city has been waiting for you."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
