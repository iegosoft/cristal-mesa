-- Recriar policies de INSERT explicitando os papéis anon e authenticated
DROP POLICY IF EXISTS "Qualquer um cria pedido" ON public.pedidos;
DROP POLICY IF EXISTS "Qualquer um insere itens de pedido existente" ON public.itens_pedido;

CREATE POLICY "Qualquer um cria pedido"
ON public.pedidos
FOR INSERT
TO anon, authenticated
WITH CHECK (
  usuario_id IS NULL OR usuario_id = auth.uid()
);

CREATE POLICY "Qualquer um insere itens de pedido existente"
ON public.itens_pedido
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pedidos p
    WHERE p.id = itens_pedido.pedido_id
      AND (p.usuario_id IS NULL OR p.usuario_id = auth.uid())
  )
);