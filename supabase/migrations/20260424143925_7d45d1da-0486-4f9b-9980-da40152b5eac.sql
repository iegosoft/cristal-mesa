CREATE OR REPLACE FUNCTION public.can_insert_item_into_order(_pedido_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.pedidos p
    WHERE p.id = _pedido_id
      AND (
        (auth.uid() IS NULL AND p.usuario_id IS NULL)
        OR (auth.uid() IS NOT NULL AND p.usuario_id = auth.uid())
      )
  );
$$;

DROP POLICY IF EXISTS "Qualquer um insere itens de pedido existente" ON public.itens_pedido;

CREATE POLICY "Qualquer um insere itens de pedido existente"
ON public.itens_pedido
FOR INSERT
TO anon, authenticated
WITH CHECK (public.can_insert_item_into_order(pedido_id));