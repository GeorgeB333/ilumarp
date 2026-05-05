import { motion } from "framer-motion";

const features = [
  {
    num: "01",
    title: "Economie care sângerează",
    desc: "Inflație. Lanțuri de aprovizionare. Piețe negre. Banii circulă pentru că jucătorii îi mișcă — nu scripturile.",
  },
  {
    num: "02",
    title: "Patruzeci de cariere, o singură scară",
    desc: "De la mecanic de noapte la procuror districtual. Progresie, reputație și consecințe la fiecare pas.",
  },
  {
    num: "03",
    title: "Poveste scrisă în timp real",
    desc: "Titluri, alegeri, războaie între facțiuni. Ziarul raportează ce ai făcut azi-noapte.",
  },
  {
    num: "04",
    title: "Sisteme construite in-house",
    desc: "Inventar, locuințe, banking, criminalistică — toate personalizate. Nimic împrumutat. Niciun template.",
  },
  {
    num: "05",
    title: "Facțiuni cu teritoriu",
    desc: "Carteluri, sindicate, departamente. Fiecare grup are granițe, istorie și inamici care țin minte.",
  },
  {
    num: "06",
    title: "Whitelist, nu waitlist",
    desc: "Citim fiecare aplicație. Oamenii nepotriviți nu intră. Imersiunea are un preț.",
  },
];

export function Features() {
  return (
    <section id="systems" className="relative overflow-hidden py-32 md:py-44 px-6 md:px-10">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header — asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <div className="lg:col-span-5">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-xs text-primary tracking-tight">02</span>
              <span className="h-px w-12 bg-border" />
              <span className="micro-label">Sisteme</span>
            </div>
            <h2 className="display-tight text-5xl md:text-7xl">
              Proiectat <br />
              pentru <span className="text-gradient">profunzime.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
            <p className="text-muted-foreground leading-relaxed">
              Șase piloni. Fiecare conceput să opună rezistență atunci când îl forțezi.
              Acestea sunt bazele fiecărei interacțiuni din ILuma.
            </p>
          </div>
        </div>

        {/* Feature list — single column rows, not card grid */}
        <div className="border-t border-border">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-12 gap-4 md:gap-8 items-baseline border-b border-border py-8 md:py-10 transition-colors hover:bg-primary/[0.03]"
            >
              <div className="col-span-2 md:col-span-1 font-mono text-xs text-primary/60 group-hover:text-primary transition-colors">
                {f.num}
              </div>
              <div className="col-span-10 md:col-span-5">
                <h3
                  className="font-display text-2xl md:text-4xl text-foreground transition-colors group-hover:text-gradient"
                  style={{ fontWeight: 600 }}
                >
                  {f.title}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-5 md:col-start-8 text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
