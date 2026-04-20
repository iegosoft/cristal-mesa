import { MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { whatsappLink } from "@/lib/site";

export function ProductCard({ product }: { product: Product }) {
  const message = `Olá! Tenho interesse no produto: ${product.name} (${product.price}). Pode me passar mais informações?`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {product.category}
        </span>
        <h3 className="mt-2 font-serif text-xl text-foreground">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-serif text-lg text-foreground">{product.price}</span>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[var(--rose-deep)]"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Comprar
          </a>
        </div>
      </div>
    </article>
  );
}
