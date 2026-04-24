import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatBRL } from "@/lib/cart";
import { whatsappLink, SITE_NAME } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Vieira Decor" }] }),
  component: CheckoutPage,
});

const checkoutSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(120),
  telefone: z.string().trim().min(8, "Informe um telefone válido").max(30),
  endereco: z.string().trim().min(10, "Endereço completo").max(500),
  observacoes: z.string().trim().max(500).optional(),
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", endereco: "", observacoes: "" });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-serif text-3xl text-foreground">Carrinho vazio</h1>
        <Link to="/produtos" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-wider text-primary-foreground">
          Ver produtos
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);

    // Busca imagens dos produtos para enriquecer a mensagem
    const productIds = [...new Set(items.map((item) => item.id))];
    const [{ data: produtosData }, { data: extrasData }] = await Promise.all([
      supabase.from("produtos").select("id, imagem_url").in("id", productIds),
      supabase
        .from("produto_imagens")
        .select("produto_id, url, ordem")
        .in("produto_id", productIds)
        .order("ordem", { ascending: true }),
    ]);

    const imageMap = new Map<string, string>();
    for (const produto of produtosData ?? []) {
      if (produto.imagem_url) imageMap.set(produto.id, produto.imagem_url);
    }
    for (const extra of extrasData ?? []) {
      if (!imageMap.has(extra.produto_id)) imageMap.set(extra.produto_id, extra.url);
    }

    // Código curto do pedido (não persistido — só pra referência na conversa)
    const codigo = Math.random().toString(36).slice(2, 8).toUpperCase();
    const dataHora = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const divisor = "━━━━━━━━━━━━━━━━━━━━";

    const itensTexto = items
      .map((i, idx) => {
        const subtotal = formatBRL(i.preco * i.quantidade);
        const unit = formatBRL(i.preco);
        const imageUrl = imageMap.get(i.id) ?? i.imagem_url;
        const linhas = [
          `*${idx + 1}.* ${i.nome}`,
          `   ▸ Quantidade: *${i.quantidade}*`,
          `   ▸ Valor unitário: ${unit}`,
          `   ▸ Subtotal: *${subtotal}*`,
        ];
        if (imageUrl) linhas.push(`   📷 ${imageUrl}`);
        return linhas.join("\n");
      })
      .join("\n\n");

    const totalItens = items.reduce((s, i) => s + i.quantidade, 0);

    const msg = [
      `✨ *NOVO PEDIDO — ${SITE_NAME.toUpperCase()}* ✨`,
      divisor,
      `🧾 *Código:* #${codigo}`,
      `📅 *Data:* ${dataHora}`,
      ``,
      `👤 *DADOS DO CLIENTE*`,
      divisor,
      `*Nome:* ${parsed.data.nome}`,
      `*WhatsApp:* ${parsed.data.telefone}`,
      `*Endereço de entrega:*`,
      parsed.data.endereco,
      ``,
      `🛍️ *ITENS DO PEDIDO* (${totalItens} ${totalItens === 1 ? "peça" : "peças"})`,
      divisor,
      itensTexto,
      ``,
      divisor,
      `💎 *TOTAL: ${formatBRL(total)}*`,
      divisor,
      parsed.data.observacoes ? `\n📝 *Observações:*\n${parsed.data.observacoes}\n` : "",
      `Olá! Gostaria de confirmar este pedido. Aguardo o retorno com as opções de pagamento e prazo de entrega. 💐`,
    ]
      .filter(Boolean)
      .join("\n");

    clear();
    toast.success("Abrindo WhatsApp para finalizar seu pedido...");
    window.open(whatsappLink(msg), "_blank");
    navigate({ to: "/" });
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Finalizar</span>
        <h1 className="mt-2 font-serif text-4xl text-foreground md:text-5xl">Checkout</h1>
        <p className="mt-3 max-w-xl text-sm font-light text-muted-foreground">
          Preencha seus dados abaixo. Ao confirmar, abriremos o WhatsApp com o resumo
          do seu pedido para finalizarmos com você.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border/60 bg-card p-6">
          <Field label="Nome completo">
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Telefone (WhatsApp)">
            <input
              required
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="input"
            />
          </Field>
          <Field label="Endereço de entrega">
            <textarea
              required
              rows={3}
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              placeholder="Rua, número, complemento, bairro, cidade, CEP"
              className="input resize-none"
            />
          </Field>
          <Field label="Observações (opcional)">
            <textarea
              rows={2}
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              className="input resize-none"
            />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar pedido pelo WhatsApp"}
          </button>
          <p className="text-center text-xs font-light text-muted-foreground">
            Não é necessário criar conta. Você fala direto com a Vieira Decor.
          </p>
        </form>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-serif text-xl text-foreground">Resumo</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2 text-muted-foreground">
                <span>{i.quantidade}x {i.nome}</span>
                <span>{formatBRL(i.preco * i.quantidade)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-light text-muted-foreground">Total</span>
            <span className="font-serif text-2xl text-foreground">{formatBRL(total)}</span>
          </div>
        </aside>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 300;
          color: var(--foreground);
          outline: none;
        }
        .input:focus { border-color: var(--primary); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
