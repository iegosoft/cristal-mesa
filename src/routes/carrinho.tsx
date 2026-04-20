import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, formatBRL } from "@/lib/cart";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — Mesa & Cristal" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, total, setQuantity, remove } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Carrinho</span>
        <h1 className="mt-2 font-serif text-4xl text-foreground md:text-5xl">Seu pedido</h1>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl text-foreground">Seu carrinho está vazio</p>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Adicione peças do nosso catálogo para começar.
          </p>
          <Link
            to="/produtos"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)]"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                  {item.imagem_url && (
                    <img src={item.imagem_url} alt={item.nome} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg text-foreground">{item.nome}</h3>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button onClick={() => setQuantity(item.id, item.quantidade - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                      <span className="min-w-[2rem] text-center text-sm">{item.quantidade}</span>
                      <button onClick={() => setQuantity(item.id, item.quantidade + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="font-serif text-lg text-foreground">
                      {formatBRL(item.preco * item.quantidade)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-xl text-foreground">Resumo</h2>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-light text-muted-foreground">Total</span>
              <span className="font-serif text-2xl text-foreground">{formatBRL(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)]"
            >
              Finalizar pedido
            </Link>
            <Link
              to="/produtos"
              className="mt-3 flex w-full items-center justify-center text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              Continuar comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
