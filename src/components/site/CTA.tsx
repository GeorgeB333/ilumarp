import { motion } from "framer-motion";
import cityAerial from "@/assets/city-aerial.jpg";

export function CTA() {
  return (
    <section id="enter" className="relative overflow-hidden">
      {/* Big aerial backdrop */}
      <div className="absolute inset-0">
        <img
          src={cityAerial}
          alt="Aerial view of the city at night"
          loading="lazy"
          width={1920}
          height={1088}
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
      </div>

      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-40 md:py-56"
      >
        <div className="mb-12 flex items-center gap-4">
          <span className="font-mono text-xs text-primary tracking-tight">05</span>
          <span className="h-px w-12 bg-border" />
          <span className="micro-label">Ultima Transmisie</span>
        </div>

        <h2 className="display-tight text-6xl md:text-8xl lg:text-[10rem] max-w-[14ch]">
          Orașul te <br />
          <span className="text-gradient">așteaptă.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <p className="lg:col-span-5 text-2xl md:text-3xl text-foreground font-display tracking-wide" style={{ fontWeight: 600 }}>
            Ești gata <br />să intri?
          </p>

          <div className="lg:col-span-4 lg:col-start-8">
            <a href="#" className="btn-cine btn-cine--solid w-full" style={{ padding: "1.25rem 1.75rem" }}>
              <span className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
                </span>
                Intră în Oraș
              </span>
              <span className="btn-arrow">↗</span>
            </a>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              › Whitelist · Rage MP · Citim fiecare aplicație
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 md:px-10">
      <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          © {new Date().getFullYear()} ILuma · Un Server de Roleplay Rage MP
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          [ Creat de jucători · pentru jucători ]
        </div>
      </div>
    </footer>
  );
}
