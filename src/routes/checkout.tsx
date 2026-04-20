import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCart, formatBRL } from "@/lib/cart";
import { whatsappLink } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Mesa & Cristal" }] }),
  component: CheckoutPage,
});

const checkoutSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(120),
  telefone: z.string().trim().min(8, "Informe um telefone válido").max(30),
  endereco: z.string().trim().min(10, "Endereço completo").max(500),
  observacoes: z.string().trim().max(500).optional(),
});

function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", endereco: "", observacoes: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Faça login para finalizar o pedido");
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("nome, telefone, endereco")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm((f) => ({
            nome: data.nome || f.nome,
            telefone: data.telefone || f.telefone,
            endereco: data.endereco || f.endereco,
            observacoes: f.observacoes,
          }));
        }
      });
  }, [user]);

  if (authLoading || !user) {
    return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

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

    const { data: pedido, error: pedidoErr } = await supabase
      .from("pedidos")
      .insert({
        usuario_id: user.id,
        total,
        status: "pendente",
        nome_cliente: parsed.data.nome,
        telefone: parsed.data.telefone,
        endereco: parsed.data.endereco,
        observacoes: parsed.data.observacoes || null,
      })
      .select("id")
      .single();

    if (pedidoErr || !pedido) {
      toast.error("Erro ao criar pedido: " + (pedidoErr?.message ?? "desconhecido"));
      setSubmitting(false);
      return;
    }

    const { error: itensErr } = await supabase.from("itens_pedido").insert(
      items.map((i) => ({
        pedido_id: pedido.id,
        produto_id: i.id,
        nome_produto: i.nome,
        quantidade: i.quantidade,
        preco_unitario: i.preco,
      })),
    );

    if (itensErr) {
      toast.error("Erro ao salvar itens: " + itensErr.message);
      setSubmitting(false);
      return;
    }

    // Atualiza profile com dados do checkout
    await supabase.from("profiles").update({
      nome: parsed.data.nome,
      telefone: parsed.data.telefone,
      endereco: parsed.data.endereco,
    }).eq("id", user.id);

    // Monta mensagem WhatsApp (com foto do produto quando disponível)
    const lines = items.map((i) => {
      const linha = `• ${i.quantidade}x ${i.nome} — ${formatBRL(i.preco * i.quantidade)}`;
      return i.imagem_url ? `${linha}\n  📷 ${i.imagem_url}` : linha;
    });
    const msg = [
      `🌸 *Novo pedido — Mesa & Cristal*`,
      `Pedido #${pedido.id.slice(0, 8)}`,
      ``,
      `*Cliente:* ${parsed.data.nome}`,
      `*Telefone:* ${parsed.data.telefone}`,
      `*Endereço:* ${parsed.data.endereco}`,
      parsed.data.observacoes ? `*Observações:* ${parsed.data.observacoes}` : "",
      ``,
      `*Itens:*`,
      ...lines,
      ``,
      `*Total:* ${formatBRL(total)}`,
    ].filter(Boolean).join("\n");

    clear();
    toast.success("Pedido criado! Abrindo WhatsApp...");
    window.open(whatsappLink(msg), "_blank");
    navigate({ to: "/" });
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Finalizar</span>
        <h1 className="mt-2 font-serif text-4xl text-foreground md:text-5xl">Checkout</h1>
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
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar pedido"}
          </button>
          <p className="text-center text-xs font-light text-muted-foreground">
            Após confirmar, abriremos o WhatsApp com o resumo para finalizar com você.
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
