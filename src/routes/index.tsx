import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Heart, Truck } from "lucide-react";
import heroImg from "@/assets/hero-table.jpg";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mesa & Cristal — Mesa posta, louças e cristais" },
      {
        name: "description",
        content:
          "Cristais lapidados, porcelanas finas e composições de mesa posta para tornar cada refeição inesquecível.",
      },
      { property: "og:title", content: "Mesa & Cristal" },
      {
        property: "og:description",
        content: "Mesa posta, louças e cristais para encantar.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24 lg:px-12 lg:py-32 max-w-7xl mx-auto">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Coleção 2026
            </span>
            <h1 className="font-serif text-4xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
              A arte de receber com <em className="text-primary not-italic">delicadeza</em>
            </h1>
            <p className="max-w-lg text-base font-light leading-relaxed text-muted-foreground md:text-lg">
              Cristais lapidados, porcelanas finas e composições de mesa posta para
              transformar cada refeição em um momento inesquecível.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[var(--rose-deep)]"
              >
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink("Olá! Gostaria de conhecer mais sobre os produtos.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-7 py-3.5 text-sm font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Fale conosco
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-elegant)]">
              <img
                src={heroImg}
                alt="Mesa posta romântica com cristais e flores"
                width={1600}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card px-6 py-4 shadow-[var(--shadow-soft)] md:block">
              <p className="font-serif text-sm italic text-muted-foreground">"cada detalhe importa"</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Peças exclusivas", text: "Curadoria cuidadosa de cristais e porcelanas únicas." },
            { icon: Heart, title: "Atendimento pessoal", text: "Conversamos pelo WhatsApp para escolher a peça ideal." },
            { icon: Truck, title: "Entrega segura", text: "Embalagem especial para todo o Brasil com muito carinho." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary shadow-[var(--shadow-soft)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-foreground">{title}</h3>
              <p className="mt-2 text-sm font-light text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Destaques</span>
            <h2 className="mt-2 font-serif text-3xl text-foreground md:text-5xl">
              Peças preferidas da casa
            </h2>
          </div>
          <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Ver tudo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div
          className="mx-auto max-w-6xl rounded-[2rem] px-8 py-16 text-center md:py-20"
          style={{ background: "var(--gradient-romantic)" }}
        >
          <h2 className="mx-auto max-w-2xl font-serif text-3xl text-foreground md:text-5xl">
            Vamos compor a sua mesa dos sonhos?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-light text-muted-foreground">
            Conte para nós sobre o seu próximo encontro e receba sugestões personalizadas.
          </p>
          <a
            href={whatsappLink("Olá! Quero ajuda para montar minha mesa posta.")}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[var(--rose-deep)]"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
