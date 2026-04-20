import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ProductCard, type ProductCardProduct } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — Mesa & Cristal" },
      {
        name: "description",
        content: "Conheça nossa coleção de cristais, porcelanas, vidros e peças de mesa posta.",
      },
      { property: "og:title", content: "Produtos — Mesa & Cristal" },
      {
        property: "og:description",
        content: "Cristais, porcelanas e mesa posta para encantar.",
      },
    ],
  }),
  component: ProductsPage,
});

const categories = ["Todos", "Cristal", "Porcelana", "Vidro", "Mesa Posta"] as const;

function ProductsPage() {
  const [products, setProducts] = useState<ProductCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<(typeof categories)[number]>("Todos");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("produtos")
      .select("id, nome, categoria, preco, descricao, imagem_url")
      .eq("ativo", true)
      .order("criado_em", { ascending: false })
      .then(({ data }) => {
        if (data) setProducts(data.map((p) => ({ ...p, preco: Number(p.preco) })));
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () => (active === "Todos" ? products : products.filter((p) => p.categoria === active)),
    [active, products],
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <header className="mb-12 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Catálogo</span>
        <h1 className="mt-2 font-serif text-4xl text-foreground md:text-6xl">Nossa coleção</h1>
        <p className="mx-auto mt-4 max-w-xl text-base font-light text-muted-foreground">
          Adicione ao carrinho e finalize seu pedido em poucos passos.
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

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center font-light text-muted-foreground">
          Nenhum produto encontrado nesta categoria.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
