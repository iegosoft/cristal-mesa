import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatBRL } from "@/lib/cart";
import { toast } from "sonner";

type Produto = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  descricao: string;
  imagem_url: string | null;
  estoque: number;
};

export const Route = createFileRoute("/produto/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [galeria, setGaleria] = useState<string[]>([]);
  const [imagemAtiva, setImagemAtiva] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    (async () => {
      const { data: prod } = await supabase
        .from("produtos")
        .select("id, nome, categoria, preco, descricao, imagem_url, estoque")
        .eq("id", id)
        .eq("ativo", true)
        .maybeSingle();
      if (cancelado) return;
      if (prod) {
        const principal = prod.imagem_url ?? null;
        setProduto({ ...prod, preco: Number(prod.preco) });
        const { data: extras } = await supabase
          .from("produto_imagens")
          .select("url")
          .eq("produto_id", id)
          .order("ordem", { ascending: true });
        if (cancelado) return;
        const urlsExtras = (extras ?? []).map((e) => e.url);
        const todas = [principal, ...urlsExtras].filter((u): u is string => !!u);
        setGaleria(todas);
        setImagemAtiva(todas[0] ?? null);
      }
      setLoading(false);
    })();
    return () => { cancelado = true; };
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!produto) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-serif text-3xl text-foreground">Produto não encontrado</h1>
        <Link to="/produtos" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Voltar aos produtos
        </Link>
      </div>
    );
  }

  const imagemCarrinho = imagemAtiva ?? produto.imagem_url;

  const handleAdd = () => {
    add({ id: produto.id, nome: produto.nome, preco: produto.preco, imagem_url: imagemCarrinho }, qty);
    toast.success(`${produto.nome} adicionado ao carrinho`);
  };

  const handleBuyNow = () => {
    add({ id: produto.id, nome: produto.nome, preco: produto.preco, imagem_url: imagemCarrinho }, qty);
    navigate({ to: "/carrinho" });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <Link to="/produtos" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-soft)]">
            {imagemAtiva ? (
              <img src={imagemAtiva} alt={produto.nome} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">sem imagem</div>
            )}
          </div>
          {galeria.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {galeria.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setImagemAtiva(url)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 bg-muted transition-all ${
                    imagemAtiva === url ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label="Ver foto"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{produto.categoria}</span>
          <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">{produto.nome}</h1>
          <p className="mt-4 font-serif text-3xl text-foreground">{formatBRL(produto.preco)}</p>
          <p className="mt-6 text-base font-light leading-relaxed text-muted-foreground">{produto.descricao}</p>

          {produto.estoque > 0 ? (
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-primary">
              {produto.estoque} em estoque
            </p>
          ) : (
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-destructive">
              Esgotado
            </p>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-foreground hover:text-primary"
                aria-label="Diminuir"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2rem] text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(produto.estoque || 99, q + 1))}
                className="p-3 text-foreground hover:text-primary"
                aria-label="Aumentar"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleAdd}
              disabled={produto.estoque === 0}
              className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" /> Adicionar
            </button>
            <button
              onClick={handleBuyNow}
              disabled={produto.estoque === 0}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[var(--rose-deep)] disabled:opacity-50"
            >
              Comprar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
