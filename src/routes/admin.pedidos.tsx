import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/cart";
import { toast } from "sonner";

type Pedido = {
  id: string;
  total: number;
  status: string;
  nome_cliente: string;
  telefone: string;
  endereco: string;
  observacoes: string | null;
  criado_em: string;
};

type Item = {
  id: string;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
};

const STATUS = ["pendente", "pago", "enviado", "entregue", "cancelado"] as const;

export const Route = createFileRoute("/admin/pedidos")({
  component: AdminPedidosPage,
});

function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [items, setItems] = useState<Record<string, Item[]>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("pedidos")
      .select("id, total, status, nome_cliente, telefone, endereco, observacoes, criado_em")
      .order("criado_em", { ascending: false });
    if (data) setPedidos(data.map((p) => ({ ...p, total: Number(p.total) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!items[id]) {
      const { data } = await supabase
        .from("itens_pedido")
        .select("id, nome_produto, quantidade, preco_unitario")
        .eq("pedido_id", id);
      if (data) setItems((s) => ({ ...s, [id]: data.map((i) => ({ ...i, preco_unitario: Number(i.preco_unitario) })) }));
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("pedidos").update({ status: status as Pedido["status"] }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Status atualizado"); load(); }
  };

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl text-foreground">Pedidos</h2>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : pedidos.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
          <p className="font-light text-muted-foreground">Nenhum pedido ainda.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {pedidos.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              <button onClick={() => toggle(p.id)} className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-secondary/40">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">#{p.id.slice(0, 8)}</span>
                    <span className="font-medium text-foreground">{p.nome_cliente}</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${p.status === "pendente" ? "bg-gold/20 text-foreground" : p.status === "cancelado" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-light text-muted-foreground">
                    {new Date(p.criado_em).toLocaleString("pt-BR")} • {p.telefone}
                  </p>
                </div>
                <span className="font-serif text-lg text-foreground">{formatBRL(p.total)}</span>
                {expanded === p.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {expanded === p.id && (
                <div className="border-t border-border/60 bg-secondary/20 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Endereço</h4>
                      <p className="mt-1 text-sm font-light text-foreground">{p.endereco}</p>
                      {p.observacoes && (
                        <>
                          <h4 className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Observações</h4>
                          <p className="mt-1 text-sm font-light text-foreground">{p.observacoes}</p>
                        </>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Itens</h4>
                      <ul className="mt-1 space-y-1 text-sm">
                        {(items[p.id] || []).map((i) => (
                          <li key={i.id} className="flex justify-between text-foreground">
                            <span>{i.quantidade}x {i.nome_produto}</span>
                            <span>{formatBRL(i.preco_unitario * i.quantidade)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Atualizar status:</span>
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs"
                    >
                      {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
