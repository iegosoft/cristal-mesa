import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-table.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós — Mesa & Cristal" },
      {
        name: "description",
        content: "Conheça a história da Mesa & Cristal — paixão por receber com elegância.",
      },
      { property: "og:title", content: "Sobre — Mesa & Cristal" },
      {
        property: "og:description",
        content: "Nossa história e o cuidado com cada peça.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-elegant)]">
          <img src={heroImg} alt="Mesa posta" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Nossa história</span>
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">
            Receber é um gesto de amor
          </h1>
          <p className="text-base font-light leading-relaxed text-muted-foreground">
            A Mesa &amp; Cristal nasceu do encanto por mesas postas — daquelas que transformam
            um almoço comum em memória afetiva. Cada peça é escolhida a dedo, com atenção aos
            detalhes, à textura, ao brilho e à harmonia.
          </p>
          <p className="text-base font-light leading-relaxed text-muted-foreground">
            Trabalhamos com cristais lapidados, porcelanas finas e vidros artesanais que carregam
            uma estética romântica e atemporal. Nosso desejo é que sua mesa seja sempre o lugar
            mais bonito da casa.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { n: "+10", l: "anos de paixão" },
              { n: "+500", l: "mesas postas" },
              { n: "100%", l: "feito com amor" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-secondary/50 p-4 text-center">
                <p className="font-serif text-2xl text-primary">{s.n}</p>
                <p className="mt-1 text-xs font-light text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
