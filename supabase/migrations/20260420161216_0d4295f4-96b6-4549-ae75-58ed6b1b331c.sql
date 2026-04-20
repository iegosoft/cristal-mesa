
-- Fix 1: search_path nas funções
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$;

-- Fix 2: bucket de produtos não deve permitir LISTAR para qualquer um.
-- Imagens continuam acessíveis via URL pública (Supabase Storage permite GET por URL em buckets públicos),
-- mas removemos a policy SELECT que permitia listar todo o conteúdo.
DROP POLICY IF EXISTS "Imagens de produtos públicas" ON storage.objects;

CREATE POLICY "Admin lista imagens do bucket produtos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
