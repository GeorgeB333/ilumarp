import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 py-3 md:py-4 transition-[background-color,backdrop-filter] duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-background/60 md:bg-gradient-to-b md:from-background/30 md:via-background/14 md:to-transparent"
          : "bg-transparent"
      }`}
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 sm:px-6 md:px-10">
        <Logo size={38} className="opacity-90 hover:opacity-100 transition-opacity" />

        <div className="flex items-center gap-2 sm:gap-3">
          <SocialButton
            href="https://www.tiktok.com/@illusioncommunity"
            label="TikTok"
            action="Urmărește"
            color="var(--brand-primary)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A145.55 145.55 0 1 1 184.11 204.06a146.91 146.91 0 0 1 3.12 0V279a74.52 74.52 0 1 0 54.4 70.38V0h79.92a108.94 108.94 0 0 0 108.78 108.78z" />
              </svg>
            }
          />

          <SocialButton
            href="https://discord.com/invite/iluma"
            label="Discord"
            action="Intră"
            color="var(--brand-secondary)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path d="M524.531 69.836a1.5 1.5 0 0 0-.764-.7A485.065 485.065 0 0 0 404.081 32.03a1.816 1.816 0 0 0-1.923.91 337.461 337.461 0 0 0-14.9 30.6 447.848 447.848 0 0 0-134.426 0 309.541 309.541 0 0 0-15.135-30.6 1.89 1.89 0 0 0-1.924-.91 483.689 483.689 0 0 0-119.688 37.107 1.712 1.712 0 0 0-.788.676C39.068 183.651 18.186 294.69 28.43 404.354a2.016 2.016 0 0 0 .765 1.375 487.666 487.666 0 0 0 146.825 74.189 1.9 1.9 0 0 0 2.063-.676A348.2 348.2 0 0 0 208.12 430.4a1.86 1.86 0 0 0-1.019-2.588 321.173 321.173 0 0 1-45.868-21.853 1.885 1.885 0 0 1-.185-3.126 251.047 251.047 0 0 0 9.109-7.137 1.819 1.819 0 0 1 1.9-.256c96.229 43.917 200.41 43.917 295.5 0a1.812 1.812 0 0 1 1.924.233 234.533 234.533 0 0 0 9.132 7.16 1.884 1.884 0 0 1-.162 3.126 301.407 301.407 0 0 1-45.89 21.83 1.875 1.875 0 0 0-1 2.611 391.055 391.055 0 0 0 30.014 48.815 1.864 1.864 0 0 0 2.063.7A486.048 486.048 0 0 0 610.7 405.729a1.882 1.882 0 0 0 .765-1.352c12.264-126.783-20.532-236.912-86.934-334.541zM222.491 337.58c-28.972 0-52.844-26.587-52.844-59.239s23.409-59.241 52.844-59.241c29.665 0 53.306 26.82 52.843 59.239 0 32.654-23.41 59.241-52.843 59.241zm195.38 0c-28.971 0-52.843-26.587-52.843-59.239s23.409-59.241 52.843-59.241c29.667 0 53.307 26.820 52.844 59.239 0 32.654-23.177 59.241-52.844 59.241z" />
              </svg>
            }
          />
        </div>
      </div>
    </motion.header>
  );
}

function SocialButton({
  href,
  label,
  action,
  color,
  icon,
}: {
  href: string;
  label: string;
  action: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group relative h-9 w-9 sm:h-[38px] sm:w-[130px] overflow-hidden rounded-full border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:bg-black/60"
      style={{ "--brand": color } as React.CSSProperties}
    >
      {/* Moving color fill */}
      <div className="absolute inset-0 z-0 translate-x-[-100%] bg-[var(--brand)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 opacity-90" />

      {/* Default State */}
      <div className="relative z-10 flex h-full items-center justify-center sm:transition-opacity sm:duration-300 sm:group-hover:opacity-0">
        <div className="flex items-center gap-2 sm:pl-2">
          <div className="h-[18px] w-[18px] sm:h-5 sm:w-5 fill-[var(--brand)] drop-shadow-[0_0_8px_var(--brand)]">
            {icon}
          </div>
          <span className="hidden sm:inline font-display text-[14px] font-bold tracking-[0.05em] uppercase text-white/90">
            {label}
          </span>
        </div>
      </div>

      {/* Hover State - Sliding Animation (desktop only) */}
      <div className="absolute inset-0 z-20 hidden sm:flex h-full items-center px-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
        <span className="font-display text-[14px] font-bold uppercase tracking-[0.05em] text-black translate-x-[-20px] transition-transform duration-500 delay-75 group-hover:translate-x-0">
          {action}
        </span>
        <div className="absolute right-3 h-5 w-5 fill-black transition-transform duration-500 group-hover:scale-110">
          {icon}
        </div>
      </div>

      {/* External glow */}
      <div className="absolute -inset-px rounded-full opacity-0 shadow-[0_0_20px_var(--brand)] transition-opacity duration-500 group-hover:opacity-40" />
    </a>
  );
}
