import { useEffect } from "react";
import Lenis from "lenis";
import { usePerformance } from "@/hooks/use-performance";

export function SmoothScroll() {
  const { lowEnd, reducedMotion, coarsePointer } = usePerformance();

  useEffect(() => {
    // Skip Lenis entirely on low-end / touch / reduced-motion — native scroll is cheaper.
    if (lowEnd || reducedMotion || coarsePointer) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [lowEnd, reducedMotion, coarsePointer]);

  return null;
}
