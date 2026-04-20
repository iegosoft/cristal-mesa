import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/produtos/novo")({
  component: NovoProdutoPage,
});

function NovoProdutoPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Link to="/admin/produtos" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h2 className="mb-6 font-serif text-2xl text-foreground">Novo produto</h2>
      <ProdutoForm
        initial={{
          nome: "",
          descricao: "",
          preco: "",
          estoque: "0",
          categoria: "Mesa Posta",
          imagem_url: "",
          ativo: true,
        }}
        submitLabel="Criar produto"
        onSubmit={async (values) => {
          const { error } = await supabase.from("produtos").insert({
            nome: values.nome,
            descricao: values.descricao,
            preco: Number(values.preco),
            estoque: Number(values.estoque),
            categoria: values.categoria,
            imagem_url: values.imagem_url || null,
            ativo: values.ativo,
          });
          if (error) toast.error(error.message);
          else {
            toast.success("Produto criado!");
            navigate({ to: "/admin/produtos" });
          }
        }}
      />
    </div>
  );
}
