import { useEffect, useState } from "react";

const TARGET = new Date("2026-06-30T00:00:00+03:00").getTime();

function parts(diff: number) {
  const c = Math.max(0, diff);
  return {
    d: Math.floor(c / 86400000),
    h: Math.floor((c / 3600000) % 24),
    m: Math.floor((c / 60000) % 60),
    s: Math.floor((c / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col">
      <div
        className="font-display text-5xl md:text-6xl text-foreground tabular-nums leading-none"
        style={{ fontWeight: 400 }}
      >
        {v}
      </div>
      <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function Countdown() {
  const [p, setP] = useState(() => parts(TARGET - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setP(parts(TARGET - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-end gap-8 md:gap-12">
      <Unit value={p.d} label="Days" />
      <div className="font-display text-3xl text-primary/40 pb-6">/</div>
      <Unit value={p.h} label="Hours" />
      <div className="font-display text-3xl text-primary/40 pb-6">/</div>
      <Unit value={p.m} label="Minutes" />
      <div className="hidden md:flex items-end gap-12">
        <div className="font-display text-3xl text-primary/40 pb-6">/</div>
        <Unit value={p.s} label="Seconds" />
      </div>
    </div>
  );
}
