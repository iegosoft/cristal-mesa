import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-table.png";

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
          <img
            src={heroImg}
            alt="Mesa posta"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Nossa história
          </span>

          <h1 className="font-serif text-4xl text-foreground md:text-5xl">
            Receber é um gesto de amor
          </h1>

          <p className="text-base font-light leading-relaxed text-muted-foreground">
            A Vieira Decor não nasceu apenas como um negócio, mas como a extensão
            dos valores que cultivamos em nossa mesa e em nosso lar. Somos uma
            família católica que acredita que a casa é o santuário da vida, e que
            os momentos compartilhados em família são as maiores bênçãos que
            podemos receber.
          </p>

          <p className="text-base font-light leading-relaxed text-muted-foreground">
            A ideia de fundar a Vieira Decor surgiu da nossa própria vivência.
            Para nós, a educação familiar e o respeito às tradições são a base de
            tudo. Percebemos que, ao redor de uma mesa bem posta, as conversas
            fluem melhor, os laços se fortalecem e os valores são transmitidos de
            geração em geração.
          </p>

          <p className="text-base font-light leading-relaxed text-muted-foreground">
            Foi esse desejo de ajudar outras famílias a celebrarem a vida com
            beleza e dignidade que nos motivou a curar uma linha exclusiva de
            taças e utensílios de vidro e cristal.
          </p>

          <p className="text-base font-light leading-relaxed text-muted-foreground">
            Nossa missão vai além de vender produtos; buscamos oferecer
            instrumentos para que seus momentos de hospitalidade e celebração
            sejam inesquecíveis. Cada peça em nosso catálogo é escolhida pela
            Família Vieira com o mesmo carinho e critério que usamos para a nossa
            própria casa.
          </p>

          <p className="text-base font-light leading-relaxed text-muted-foreground">
            Trabalhamos com cristais lapidados, porcelanas finas e vidros
            artesanais que carregam uma estética romântica e atemporal. Nosso
            desejo é que sua mesa seja sempre o lugar mais bonito da casa.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { n: "+100", l: "Vendas" },
              { n: "+100", l: "Produtos" },
              { n: "100%", l: "feito com amor" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl bg-secondary/50 p-4 text-center"
              >
                <p className="font-serif text-2xl text-primary">{s.n}</p>
                <p className="mt-1 text-xs font-light text-muted-foreground">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}