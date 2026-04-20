-- Tabela de imagens adicionais por produto
CREATE TABLE public.produto_imagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_produto_imagens_produto_id ON public.produto_imagens(produto_id);
CREATE INDEX idx_produto_imagens_ordem ON public.produto_imagens(produto_id, ordem);

ALTER TABLE public.produto_imagens ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ver imagens de produtos ativos
CREATE POLICY "Qualquer um vê imagens de produtos ativos"
ON public.produto_imagens
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.produtos p
    WHERE p.id = produto_imagens.produto_id AND p.ativo = true
  )
);

-- Admin gerencia tudo
CREATE POLICY "Admin gerencia imagens"
ON public.produto_imagens
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin vê todas (mesmo de produtos inativos)
CREATE POLICY "Admin vê todas as imagens"
ON public.produto_imagens
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));