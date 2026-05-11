import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
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

// â”€â”€ Countdown logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// June 30, 2026 — fixed Bucharest date
const TARGET = new Date("2026-06-30T00:00:00+03:00").getTime();
function getParts(diff: number) {
  const c = Math.max(0, diff);
  return {
    d: Math.floor(c / 86400000),
    h: Math.floor((c / 3600000) % 24),
    m: Math.floor((c / 60000) % 60),
    s: Math.floor((c / 1000) % 60),
  };
}

// â”€â”€ CountdownUnit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SCRAMBLE_CHARS = "0123456789#@%&*/?!+=";

function CountdownUnit({ value, label, locked = false }: { value: number; label: string; locked?: boolean }) {
  const [scramble, setScramble] = useState("??");

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => {
      const a = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      const b = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      setScramble(a + b);
    }, 90);
    return () => clearInterval(id);
  }, [locked]);

  const display = locked ? scramble : String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div
        className="font-display text-4xl sm:text-5xl md:text-6xl tabular-nums leading-none select-none relative"
        style={{
          fontWeight: 700,
          color: locked ? "rgba(16, 250, 223, 0.95)" : undefined,
          filter: locked
            ? "drop-shadow(0 0 12px rgba(16, 250, 223, 0.55)) drop-shadow(0 0 28px rgba(16, 250, 223, 0.2))"
            : undefined,
          fontFamily: locked ? "var(--font-mono)" : undefined,
        }}
      >
        {display}
      </div>
      <div
        className="mt-2 font-display text-[10px] sm:text-xs uppercase tracking-widest"
        style={{
          fontWeight: 400,
          color: locked ? "rgba(16, 250, 223, 0.7)" : "var(--muted-foreground)",
          letterSpacing: locked ? "0.3em" : undefined,
        }}
      >
        {locked ? `[${label}]` : label}
      </div>
    </div>
  );
}

// â”€â”€ Video + Countdown overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const YT_VIDEO_ID = "ik3-B39EWN0";
const YT_START = 1;
const PEAK_VOLUME = 20;

// Smoothstep easing for cinematic audio fades
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function getVolumeForProgress(p: number) {
  const pc = Math.max(0, Math.min(1, p));
  // Fade in: 0.3 -> 0.7 (gentle rise starting before fullscreen)
  const fadeIn = smoothstep(0.3, 0.7, pc);
  // Fade out: 0.75 -> 1 (long graceful tail)
  const fadeOut = 1 - smoothstep(0.75, 1, pc);
  return PEAK_VOLUME * fadeIn * fadeOut;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

function VideoCountdown({ time }: { time: { d: number; h: number; m: number; s: number } }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const unmutedRef = useRef(false);
  const lastVolumeRef = useRef(0);
  const [unmuted, setUnmuted] = useState(false);
  const [ready, setReady] = useState(false);

  const { scrollYProgress: rawProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end end"],
  });
  // Spring smoothing — natural feel both directions
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.45,
  });
  // Separate, slower spring for audio — keeps sound from cutting on quick scrolls
  const audioProgress = useSpring(rawProgress, {
    stiffness: 35,
    damping: 26,
    mass: 1.1,
  });

  // 0.45 -> 0.8 : card expands smoothly to fullscreen (after section is fully in view)
  // Initial state: balanced inset on all sides
  const top = useTransform(scrollYProgress, [0.4, 0.8], ["12vh", "0vh"]);
  const bottom = useTransform(scrollYProgress, [0.4, 0.8], ["12vh", "0vh"]);
  const left = useTransform(scrollYProgress, [0.4, 0.8], ["9vw", "0vw"]);
  const right = useTransform(scrollYProgress, [0.4, 0.8], ["9vw", "0vw"]);
  const borderRadius = useTransform(scrollYProgress, [0.4, 0.8], ["28px", "0px"]);
  const borderOpacity = useTransform(scrollYProgress, [0.4, 0.8], [0.5, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.8], [1, 0.35]);
  const countdownOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.78], [1, 0.5, 0]);
  const countdownY = useTransform(scrollYProgress, [0.4, 0.78], [0, -120]);
  const countdownScale = useTransform(scrollYProgress, [0.4, 0.78], [1, 0.92]);
  // 0.9 -> 1 : video slides up and fades out
  const videoOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const videoY = useTransform(scrollYProgress, [0.9, 1], ["0vh", "-8vh"]);

  // Sound fade tied to scroll (slow spring — graceful, doesn't cut on fast scrolls)
  useMotionValueEvent(audioProgress, "change", (p) => {
    if (!unmutedRef.current || !playerRef.current?.setVolume) return;
    const vol = Math.round(getVolumeForProgress(p));
    if (vol !== lastVolumeRef.current) {
      playerRef.current.setVolume(vol);
      lastVolumeRef.current = vol;
    }
  });

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled || !playerHostRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(playerHostRef.current, {
        width: "100%",
        height: "100%",
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: YT_VIDEO_ID,
          start: YT_START,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
            setReady(true);
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      const existing = document.querySelector('script[data-yt-iframe-api]');
      if (!existing) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.setAttribute("data-yt-iframe-api", "true");
        document.body.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
    }

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, []);

  // Pause when scrolled out of view
  useEffect(() => {
    if (!scrollRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const p = playerRef.current;
        if (!p?.playVideo) return;
        if (entry.isIntersecting) {
          p.playVideo();
        } else {
          p.pauseVideo();
        }
      },
      { threshold: 0 },
    );
    obs.observe(scrollRef.current);
    return () => obs.disconnect();
  }, [ready]);

  const handleUnmute = () => {
    const p = playerRef.current;
    if (!p?.unMute || unmutedRef.current) return;

    try {
      p.unMute();
      const vol = Math.max(1, Math.round(getVolumeForProgress(scrollYProgress.get())));
      p.setVolume(vol);
      lastVolumeRef.current = vol;
      unmutedRef.current = true;
      setUnmuted(true);
    } catch {}
  };

  // Activate sound on the first real user interaction anywhere on the page.
  useEffect(() => {
    if (!ready || unmutedRef.current) return;

    const activate = () => {
      handleUnmute();
    };

    const passiveOnce: AddEventListenerOptions = { once: true, passive: true };
    const once: AddEventListenerOptions = { once: true };

    window.addEventListener("pointerdown", activate, passiveOnce);
    window.addEventListener("touchstart", activate, passiveOnce);
    window.addEventListener("keydown", activate, once);

    return () => {
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("keydown", activate);
    };
  }, [ready]);

  return (
    <section
      ref={scrollRef}
      className="relative h-[140vh] left-1/2 -translate-x-1/2 w-screen"
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <motion.div
          style={{
            top,
            bottom,
            left,
            right,
            borderRadius,
            opacity: videoOpacity,
            y: videoY,
          }}
          className="absolute overflow-hidden bg-black shadow-[0_30px_120px_-40px_rgba(16,250,223,0.25)]"
        >
          {/* Animated border */}
          <motion.div
            style={{ opacity: borderOpacity, borderRadius }}
            className="pointer-events-none absolute inset-0 border border-border z-30"
          />

          {/* Video host — oversized to crop YT chrome */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2">
              <div ref={playerHostRef} className="h-full w-full" />
            </div>
          </div>

          {/* Cinematic overlays — fade with scroll */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-transparent to-background/55" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.55)_100%)]" />
          </motion.div>

          {!unmuted && (
            <motion.button
              type="button"
              onClick={handleUnmute}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-3 top-3 z-20 overflow-hidden rounded-2xl border border-primary/30 bg-background/45 p-1.5 shadow-[0_18px_40px_-24px_rgba(16,250,223,0.45)] backdrop-blur-xl sm:right-5 sm:top-5"
              aria-label="Porneste muzica"
            >
              <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,250,223,0.15),transparent_55%)]" />
              <span className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-primary/75 to-transparent" />
              <span className="relative flex items-center gap-3 rounded-[14px] border border-white/8 bg-black/15 px-3 py-2 text-left transition-colors hover:bg-primary/10 sm:px-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/12 text-primary">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M14 5.23v13.54a1 1 0 0 1-1.64.77L7.91 16H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2.91l4.45-3.54A1 1 0 0 1 14 5.23Zm2.54 2.36a1 1 0 0 1 1.41 0 6.5 6.5 0 0 1 0 9.19 1 1 0 1 1-1.41-1.42 4.5 4.5 0 0 0 0-6.35 1 1 0 0 1 0-1.42Zm3.53-3.53a1 1 0 0 1 1.41 0 11.5 11.5 0 0 1 0 16.27 1 1 0 0 1-1.41-1.42 9.5 9.5 0 0 0 0-13.43 1 1 0 0 1 0-1.42Z" />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary/70">
                    Audio Sync
                  </span>
                  <span className="font-display text-xs uppercase tracking-[0.12em] text-foreground sm:text-sm">
                    Porneste muzica
                  </span>
                </span>
              </span>
            </motion.button>
          )}

          {/* Countdown card overlay — fades & slides up on scroll */}
          <motion.div
            style={{
              opacity: countdownOpacity,
              y: countdownY,
              scale: countdownScale,
            }}
            className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6"
          >
            <div className="relative w-full max-w-[720px] rounded-2xl border border-border/60 bg-background/40 px-5 py-7 sm:px-10 sm:py-10 md:px-14 md:py-12 backdrop-blur-2xl">
              <span className="pointer-events-none absolute top-[8px] left-[8px] h-3 w-3 border-t border-l border-primary/70" />
              <span className="pointer-events-none absolute top-[8px] right-[8px] h-3 w-3 border-t border-r border-primary/70" />
              <span className="pointer-events-none absolute bottom-[8px] left-[8px] h-3 w-3 border-b border-l border-primary/70" />
              <span className="pointer-events-none absolute bottom-[8px] right-[8px] h-3 w-3 border-b border-r border-primary/70" />

              <div className="text-center">
                <div
                  className="font-display text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] text-primary/90 mb-4 md:mb-6"
                  style={{ fontWeight: 400 }}
                >
                  Cat mai e pana intram in oras
                </div>
                <div className="flex items-end justify-center gap-2 sm:gap-5 md:gap-9">
                  <CountdownUnit value={time.d} label="Zile" locked />
                  <span className="font-display text-2xl sm:text-3xl md:text-4xl text-primary/30 pb-3 sm:pb-4 md:pb-5">/</span>
                  <CountdownUnit value={time.h} label="Ore" />
                  <span className="font-display text-2xl sm:text-3xl md:text-4xl text-primary/30 pb-3 sm:pb-4 md:pb-5">/</span>
                  <CountdownUnit value={time.m} label="Minute" />
                  <span className="font-display text-2xl sm:text-3xl md:text-4xl text-primary/30 pb-3 sm:pb-4 md:pb-5">/</span>
                  <CountdownUnit value={time.s} label="Secunde" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// â”€â”€ Main Teaser Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function TeaserPage() {
  const [time, setTime] = useState(() => getParts(TARGET - Date.now()));
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTime(getParts(TARGET - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "-18%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.94]);

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
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 pb-16 md:pb-24">

        {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.section
          ref={heroRef}
          style={{
            opacity: heroOpacity,
            y: heroY,
            scale: heroScale,
          }}
          className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-32 md:pt-32"
        >

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
          Un oras intreg te asteapta. <span className="text-gradient">ILUMA</span> vine pe{" "}
          <span className="text-primary">RAGE:MP</span> — nu rata startul.
        </motion.p>

        </motion.section>

        {/* â”€â”€ Video + Countdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <VideoCountdown time={time} />

        {/* â”€â”€ Server Info + Guide â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="relative w-full -mt-[24vh] md:-mt-[28vh] z-20">
          <div className="pointer-events-none absolute -left-[210px] top-[-270px] z-20 hidden h-[840px] w-[360px] xl:block">
            <motion.img
              src={imageMid}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, y: 60, filter: "blur(20px) drop-shadow(0 0 8px rgba(89, 222, 191, 0.15)) contrast(0.99) brightness(1.01) saturate(1.04)" }}
              whileInView={{
                opacity: 0.38,
                y: 0,
                filter: "blur(0.6px) drop-shadow(0 0 8px rgba(89, 222, 191, 0.15)) drop-shadow(0 0 20px rgba(89, 222, 191, 0.08)) contrast(0.99) brightness(1.01) saturate(1.04)",
                scale: [1, 1.016, 1],
                rotate: [-0.8, 0.8, -0.8],
              }}
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{
                scale: 1.04,
                opacity: 0.56,
                filter: "drop-shadow(0 0 20px rgba(89, 222, 191, 0.3)) drop-shadow(0 0 46px rgba(89, 222, 191, 0.18)) brightness(1.11) saturate(1.14)",
              }}
              transition={{
                opacity: { duration: 1.1, delay: 0.3 },
                y: { duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 1.1, delay: 0.3 },
                scale: { duration: 4.3, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
                rotate: { duration: 4.3, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9 }}
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
        </div>

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
      text: "Porneste Rage:MP, cauta Iluma Roleplay in lista si alatura-te serverului.",
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
