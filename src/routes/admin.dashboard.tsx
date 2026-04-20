import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ShoppingCart, DollarSign, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/cart";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [stats, setStats] = useState({ produtos: 0, ativos: 0, pedidos: 0, faturamento: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: produtos }, { count: ativos }, { data: pedidos }] = await Promise.all([
        supabase.from("produtos").select("*", { count: "exact", head: true }),
        supabase.from("produtos").select("*", { count: "exact", head: true }).eq("ativo", true),
        supabase.from("pedidos").select("total"),
      ]);
      setStats({
        produtos: produtos ?? 0,
        ativos: ativos ?? 0,
        pedidos: pedidos?.length ?? 0,
        faturamento: pedidos?.reduce((s, p) => s + Number(p.total), 0) ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Produtos", value: stats.produtos, icon: Package },
    { label: "Ativos no site", value: stats.ativos, icon: AlertCircle },
    { label: "Pedidos", value: stats.pedidos, icon: ShoppingCart },
    { label: "Faturamento", value: formatBRL(stats.faturamento), icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-serif text-2xl text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="font-serif text-xl text-foreground">Atalhos</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/produtos/novo" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)]">
            Novo produto
          </Link>
          <Link to="/admin/produtos" className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">
            Gerenciar produtos
          </Link>
          <Link to="/admin/pedidos" className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">
            Ver pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
