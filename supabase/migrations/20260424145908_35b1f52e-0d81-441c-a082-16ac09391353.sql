DELETE FROM public.itens_pedido WHERE pedido_id IN (SELECT id FROM public.pedidos WHERE status = 'pendente');
DELETE FROM public.pedidos WHERE status = 'pendente';