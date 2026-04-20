import { useState, type FormEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProdutoFormValues = {
  nome: string;
  descricao: string;
  preco: string;
  estoque: string;
  categoria: "Cristal" | "Porcelana" | "Vidro" | "Mesa Posta";
  imagem_url: string;
  ativo: boolean;
};

export function ProdutoForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial: ProdutoFormValues;
  onSubmit: (values: ProdutoFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [form, setForm] = useState<ProdutoFormValues>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem maior que 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("produtos").upload(path, file, { upsert: false });
    if (error) {
      toast.error("Falha no upload: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("produtos").getPublicUrl(path);
    setForm((f) => ({ ...f, imagem_url: data.publicUrl }));
    setUploading(false);
    toast.success("Imagem enviada");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) return toast.error("Informe o nome");
    if (!form.preco || Number(form.preco) < 0) return toast.error("Preço inválido");
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border/60 bg-card p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nome">
          <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="input" />
        </Field>
        <Field label="Categoria">
          <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as ProdutoFormValues["categoria"] })} className="input">
            <option>Cristal</option>
            <option>Porcelana</option>
            <option>Vidro</option>
            <option>Mesa Posta</option>
          </select>
        </Field>
        <Field label="Preço (R$)">
          <input type="number" step="0.01" min="0" required value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} className="input" />
        </Field>
        <Field label="Estoque">
          <input type="number" min="0" required value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} className="input" />
        </Field>
      </div>

      <Field label="Descrição">
        <textarea rows={4} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="input resize-none" />
      </Field>

      <Field label="Imagem do produto">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
            {form.imagem_url && <img src={form.imagem_url} alt="" className="h-full w-full object-cover" />}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {form.imagem_url ? "Trocar imagem" : "Enviar imagem"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        </div>
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
        <span className="text-muted-foreground">Visível no site</span>
      </label>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)] disabled:opacity-50"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
      </button>
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid var(--border);background:var(--background);padding:0.75rem 1rem;font-size:0.875rem;font-weight:300;color:var(--foreground);outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </form>
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
