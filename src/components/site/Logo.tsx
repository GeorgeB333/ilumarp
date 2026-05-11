import logoSrc from "@/assets/logo.png";

type Props = { className?: string; size?: number; showWordmark?: boolean };

export function Logo({ className = "", size = 44, showWordmark = true }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-75"
          aria-hidden="true"
        />
        <img
          src={logoSrc}
          alt="ILuma"
          width={size}
          height={size}
          className="relative h-full w-full object-contain brightness-110 contrast-110 drop-shadow-[0_0_15px_rgba(89,222,191,0.2)]"
        />
      </div>
      {showWordmark && (
        <div className="leading-none inline-flex flex-col items-stretch">
          <div
            className="text-[23px] text-gradient text-center"
            style={{
              fontFamily: "\"Tilt Warp\", var(--font-display)",
              fontWeight: 400,
              letterSpacing: "0.34em",
              paddingLeft: "0.34em",
            }}
          >
            ILUMA
          </div>
          <div
            className="mt-1.5 font-mono text-[11px] uppercase text-primary/75 text-center"
            style={{ letterSpacing: "0.21em", paddingLeft: "0.21em" }}
          >
            Stay Tuned
          </div>
        </div>
      )}
    </div>
  );
}
