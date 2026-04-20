import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { formatBRL } from "@/lib/cart";

export type ProductCardProduct = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  descricao: string;
  imagem_url: string | null;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="block aspect-square overflow-hidden bg-muted"
      >
        {product.imagem_url ? (
          <img
            src={product.imagem_url}
            alt={product.nome}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            sem imagem
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {product.categoria}
        </span>
        <Link to="/produto/$id" params={{ id: product.id }}>
          <h3 className="mt-2 font-serif text-xl text-foreground hover:text-primary">
            {product.nome}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm font-light leading-relaxed text-muted-foreground">
          {product.descricao}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-serif text-lg text-foreground">{formatBRL(product.preco)}</span>
          <Link
            to="/produto/$id"
            params={{ id: product.id }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[var(--rose-deep)]"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Ver
          </Link>
        </div>
      </div>
    </article>
  );
}
