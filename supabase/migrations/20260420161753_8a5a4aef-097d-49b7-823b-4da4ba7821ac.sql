
-- Atualiza trigger: primeiro usuário vira admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_users INT;
BEGIN
  INSERT INTO public.profiles (id, nome, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'telefone'
  );

  SELECT COUNT(*) INTO total_users FROM public.user_roles;

  IF total_users = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cliente');
  END IF;

  RETURN NEW;
END;
$$;

-- Seed de produtos exemplo
INSERT INTO public.produtos (nome, descricao, preco, estoque, categoria, ativo) VALUES
('Taça Cristal Borda Dourada', 'Conjunto com 6 taças de cristal lapidado com borda em ouro 24k.', 189.00, 10, 'Cristal', true),
('Jogo Porcelana Floral', 'Aparelho de jantar em porcelana fina com filete dourado, 20 peças.', 459.00, 5, 'Porcelana', true),
('Bowls Vidro Lapidado', 'Par de bowls em vidro trabalhado, perfeitos para sobremesas e entradas.', 129.00, 12, 'Vidro', true),
('Centro de Mesa Romântico', 'Composição completa com castiçais, vaso e detalhes em dourado envelhecido.', 329.00, 4, 'Mesa Posta', true),
('Taça Champagne Cristal', 'Conjunto com 6 taças flûte em cristal puro para brindes especiais.', 219.00, 8, 'Cristal', true),
('Pratos Rasos Borda Ouro', 'Conjunto com 6 pratos rasos em porcelana branca com borda em ouro.', 269.00, 6, 'Porcelana', true);
