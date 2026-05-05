import { motion } from "framer-motion";
import charactersImg from "@/assets/characters.png";

const stats = [
  { value: "150+", label: "Active Factions", note: "verified · whitelisted" },
  { value: "24/7", label: "Live Economy", note: "no resets · no wipes" },
  { value: "00", label: "Pay-to-Win", note: "merch only · cosmetic" },
];

export function About() {
  return (
    <section id="manifest" className="relative overflow-hidden py-32 md:py-44 px-6 md:px-10">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Top eyebrow */}
        <div className="mb-20 flex items-center gap-4">
          <span className="font-mono text-xs text-primary tracking-tight">01</span>
          <span className="h-px w-12 bg-border" />
          <span className="micro-label">Manifest</span>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — gigantic quote + Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <h2 className="display-tight text-5xl md:text-7xl lg:text-8xl">
              Nu e un server. <br />
              <span className="text-stroke">E o a doua</span> <br />
              <span className="text-gradient">viață.</span>
            </h2>
            
            <div className="mt-12 rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl relative">
               <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
               <img src={charactersImg} alt="Personaje Roleplay" className="w-full h-[400px] object-cover hover:scale-105 transition duration-1000" />
            </div>
          </motion.div>

          {/* Right — body, offset down */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:col-span-5 lg:pt-32 space-y-6"
          >
            <p className="text-foreground text-lg leading-relaxed">
              Noi nu am scris povestea. Am construit străzile, am redactat legile,
              am distrus economia intenționat — și am plecat. Ce urmează,
              depinde de tine.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Închiriază un apartament. Începe o gașcă. Condu o afacere curată sau una murdară.
              Fiecare alegere contează. Fiecare nume este memorat. Fără scurtături.
              Fără resetări. Fără avantaje cumpărate cu bani reali.
            </p>
            <div className="pt-4 flex items-center gap-3">
              <span className="font-mono text-xs text-primary">→</span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground">
                Fără reguli. Doar consecințe.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats strip — premium metric table */}
        <div className="mt-32 overflow-hidden rounded-[2rem] border border-border/50 bg-card/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="grid gap-px bg-border/20 p-1 md:grid-cols-3">
            {[
              { value: "150+", label: "Facțiuni Active", note: "verificate · whitelisted" },
              { value: "24/7", label: "Economie Live", note: "fără resetări · fără wipe-uri" },
              { value: "00", label: "Pay-to-Win", note: "doar merch · cosmetic" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-[1.5rem] bg-background/90 p-8 transition duration-500 hover:bg-background/95"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-80 blur-sm" />
                <div className="relative">
                  <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/70">
                    {s.label}
                  </div>
                  <div
                    className="mt-4 font-display text-5xl md:text-6xl text-gradient leading-none tracking-[-0.04em]"
                    style={{ fontWeight: 800 }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {s.note}
                  </div>
                  <div className="pointer-events-none absolute right-5 bottom-5 h-12 w-12 rounded-full bg-primary/10 blur-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
