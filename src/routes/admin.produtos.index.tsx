import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/cart";
import { toast } from "sonner";

type Produto = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  ativo: boolean;
  imagem_url: string | null;
};

export const Route = createFileRoute("/admin/produtos/")({
  component: AdminProdutosPage,
});

function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("produtos")
      .select("id, nome, categoria, preco, estoque, ativo, imagem_url")
      .order("criado_em", { ascending: false });
    if (data) setProdutos(data.map((p) => ({ ...p, preco: Number(p.preco) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleAtivo = async (p: Produto) => {
    const { error } = await supabase.from("produtos").update({ ativo: !p.ativo }).eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      toast.success(p.ativo ? "Produto desativado" : "Produto ativado");
      load();
    }
  };

  const handleDelete = async (p: Produto) => {
    if (!confirm(`Excluir "${p.nome}"? Esta ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from("produtos").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success("Produto excluído"); load(); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Produtos</h2>
        <Link to="/admin/produtos/novo" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)]">
          <Plus className="h-3.5 w-3.5" /> Novo produto
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : produtos.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
          <p className="font-light text-muted-foreground">Nenhum produto cadastrado ainda.</p>
          <Link to="/admin/produtos/novo" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-wider text-primary-foreground">
            Cadastrar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {p.imagem_url && <img src={p.imagem_url} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <span className="font-medium text-foreground">{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.categoria}</td>
                  <td className="px-4 py-3 font-serif">{formatBRL(p.preco)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.estoque}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${p.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleAtivo(p)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title={p.ativo ? "Desativar" : "Ativar"}>
                        {p.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <Link to="/admin/produtos/editar/$id" params={{ id: p.id }} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Editar">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(p)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
