-- 1) Tornar usuario_id opcional para permitir pedidos de visitantes
ALTER TABLE public.pedidos ALTER COLUMN usuario_id DROP NOT NULL;

-- 2) Remover policies antigas que dependem de auth.uid() para INSERT/SELECT do cliente
DROP POLICY IF EXISTS "Cliente cria pedido próprio" ON public.pedidos;
DROP POLICY IF EXISTS "Cliente vê próprios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Cliente insere itens do próprio pedido" ON public.itens_pedido;
DROP POLICY IF EXISTS "Cliente vê itens dos próprios pedidos" ON public.itens_pedido;

-- 3) Permitir que qualquer um (logado ou não) crie pedido
-- Se estiver logado, usuario_id deve ser o próprio; se não, deve ser NULL
CREATE POLICY "Qualquer um cria pedido"
ON public.pedidos
FOR INSERT
TO public
WITH CHECK (
  usuario_id IS NULL OR usuario_id = auth.uid()
);

-- 4) Cliente logado continua vendo os próprios pedidos (visitantes não veem nada — usam WhatsApp)
CREATE POLICY "Cliente logado vê próprios pedidos"
ON public.pedidos
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL AND auth.uid() = usuario_id);

-- 5) Permitir inserir itens em qualquer pedido recém-criado (visitante ou logado)
-- Como o pedido_id é gerado no momento do INSERT do pedido, validamos via EXISTS
CREATE POLICY "Qualquer um insere itens de pedido existente"
ON public.itens_pedido
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pedidos p
    WHERE p.id = itens_pedido.pedido_id
      AND (p.usuario_id IS NULL OR p.usuario_id = auth.uid())
  )
);

-- 6) Cliente logado vê itens dos próprios pedidos
CREATE POLICY "Cliente logado vê itens dos próprios pedidos"
ON public.itens_pedido
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos p
    WHERE p.id = itens_pedido.pedido_id
      AND p.usuario_id IS NOT NULL
      AND p.usuario_id = auth.uid()
  )
);