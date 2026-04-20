import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProdutoForm, type ProdutoFormValues } from "@/components/admin/ProdutoForm";
import { GaleriaProduto } from "@/components/admin/GaleriaProduto";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/produtos/editar/$id")({
  component: EditarProdutoPage,
});

function EditarProdutoPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<ProdutoFormValues | null>(null);

  useEffect(() => {
    supabase
      .from("produtos")
      .select("nome, descricao, preco, estoque, categoria, imagem_url, ativo")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setInitial({
            nome: data.nome,
            descricao: data.descricao,
            preco: String(data.preco),
            estoque: String(data.estoque),
            categoria: data.categoria as ProdutoFormValues["categoria"],
            imagem_url: data.imagem_url ?? "",
            ativo: data.ativo,
          });
        }
      });
  }, [id]);

  return (
    <div className="space-y-6">
      <Link to="/admin/produtos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h2 className="font-serif text-2xl text-foreground">Editar produto</h2>
      {!initial ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <ProdutoForm
            initial={initial}
            submitLabel="Salvar alterações"
            onSubmit={async (values) => {
              const { error } = await supabase
                .from("produtos")
                .update({
                  nome: values.nome,
                  descricao: values.descricao,
                  preco: Number(values.preco),
                  estoque: Number(values.estoque),
                  categoria: values.categoria,
                  imagem_url: values.imagem_url || null,
                  ativo: values.ativo,
                })
                .eq("id", id);
              if (error) toast.error(error.message);
              else {
                toast.success("Produto atualizado!");
                navigate({ to: "/admin/produtos" });
              }
            }}
          />
          <GaleriaProduto produtoId={id} />
        </>
      )}
    </div>
  );
}
