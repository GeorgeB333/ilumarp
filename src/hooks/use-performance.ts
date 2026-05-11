import * as React from "react";

export type PerfMode = {
  lowEnd: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  narrow: boolean;
};

const DEFAULT: PerfMode = {
  lowEnd: false,
  reducedMotion: false,
  coarsePointer: false,
  narrow: false,
};

function detect(): PerfMode {
  if (typeof window === "undefined") return DEFAULT;
  const nav: any = navigator;
  const deviceMemory: number = typeof nav.deviceMemory === "number" ? nav.deviceMemory : 8;
  const cores: number = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 8;
  const downlink: number | undefined = nav.connection?.downlink;
  const saveData: boolean = !!nav.connection?.saveData;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  const lowEnd =
    saveData ||
    deviceMemory <= 4 ||
    cores <= 4 ||
    (typeof downlink === "number" && downlink > 0 && downlink < 1.5) ||
    reducedMotion;

  return { lowEnd, reducedMotion, coarsePointer, narrow };
}

export function usePerformance(): PerfMode {
  const [mode, setMode] = React.useState<PerfMode>(() => detect());

  React.useEffect(() => {
    setMode(detect());
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqNarrow = window.matchMedia("(max-width: 767px)");
    const onChange = () => setMode(detect());
    mqMotion.addEventListener("change", onChange);
    mqNarrow.addEventListener("change", onChange);
    window.addEventListener("resize", onChange, { passive: true });
    return () => {
      mqMotion.removeEventListener("change", onChange);
      mqNarrow.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return mode;
}
