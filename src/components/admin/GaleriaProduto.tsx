import { useEffect, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAX_EXTRA = 5;

type Imagem = { id: string; url: string; ordem: number };

export function GaleriaProduto({ produtoId }: { produtoId: string }) {
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produto_imagens")
      .select("id, url, ordem")
      .eq("produto_id", produtoId)
      .order("ordem", { ascending: true });
    if (error) toast.error(error.message);
    else setImagens(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produtoId]);

  const handleUpload = async (file: File) => {
    if (imagens.length >= MAX_EXTRA) {
      toast.error(`Limite de ${MAX_EXTRA} fotos extras`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem maior que 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${produtoId}/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage.from("produtos").upload(path, file, { upsert: false });
    if (up.error) {
      toast.error("Falha no upload: " + up.error.message);
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from("produtos").getPublicUrl(path);
    const proximaOrdem = imagens.length > 0 ? Math.max(...imagens.map((i) => i.ordem)) + 1 : 0;
    const { error } = await supabase.from("produto_imagens").insert({
      produto_id: produtoId,
      url: pub.publicUrl,
      ordem: proximaOrdem,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Foto adicionada");
      await carregar();
    }
    setUploading(false);
  };

  const remover = async (id: string) => {
    const { error } = await supabase.from("produto_imagens").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      setImagens((prev) => prev.filter((i) => i.id !== id));
      toast.success("Foto removida");
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg text-foreground">Galeria de fotos</h3>
          <p className="text-xs font-light text-muted-foreground">
            Adicione até {MAX_EXTRA} fotos extras para o cliente ver melhor o produto.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {imagens.length}/{MAX_EXTRA}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {imagens.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-muted">
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remover(img.id)}
                className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1.5 text-destructive opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                aria-label="Remover foto"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {imagens.length < MAX_EXTRA && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-background text-xs font-light text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Adicionar</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
