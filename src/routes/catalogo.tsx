import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — Mesa & Cristal" },
      {
        name: "description",
        content: "Conheça nossa coleção de cristais, porcelanas, vidros e peças de mesa posta.",
      },
      { property: "og:title", content: "Catálogo — Mesa & Cristal" },
      {
        property: "og:description",
        content: "Cristais, porcelanas e mesa posta para encantar.",
      },
    ],
  }),
  component: CatalogPage,
});

const categories = ["Todos", "Cristal", "Porcelana", "Vidro", "Mesa Posta"] as const;

function CatalogPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("Todos");

  const filtered = useMemo(
    () => (active === "Todos" ? products : products.filter((p) => p.category === active)),
    [active],
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <header className="mb-12 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Catálogo</span>
        <h1 className="mt-2 font-serif text-4xl text-foreground md:text-6xl">Nossa coleção</h1>
        <p className="mx-auto mt-4 max-w-xl text-base font-light text-muted-foreground">
          Toque em qualquer peça para conversar pelo WhatsApp e finalizar o pedido.
        </p>
      </header>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
              active === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
