
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'cliente');
CREATE TYPE public.order_status AS ENUM ('pendente', 'pago', 'enviado', 'entregue', 'cancelado');
CREATE TYPE public.product_category AS ENUM ('Cristal', 'Porcelana', 'Vidro', 'Mesa Posta');

-- =========================================
-- PROFILES (dados extras do usuário)
-- =========================================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================
-- USER ROLES (separado por segurança)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função SECURITY DEFINER para checar papéis (evita recursão em RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =========================================
-- PRODUTOS
-- =========================================
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  imagem_url TEXT,
  categoria product_category NOT NULL DEFAULT 'Mesa Posta',
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- =========================================
-- PEDIDOS
-- =========================================
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status order_status NOT NULL DEFAULT 'pendente',
  nome_cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT NOT NULL,
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- =========================================
-- ITENS DO PEDIDO
-- =========================================
CREATE TABLE public.itens_pedido (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
  nome_produto TEXT NOT NULL,
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario >= 0),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

-- =========================================
-- TRIGGERS: atualiza atualizado_em
-- =========================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_produtos_updated BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_pedidos_updated BEFORE UPDATE ON public.pedidos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================
-- TRIGGER: cria profile + role 'cliente' ao registrar
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'telefone'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cliente');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- RLS POLICIES
-- =========================================

-- profiles
CREATE POLICY "Usuário vê próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Admin vê todos os perfis"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Usuário atualiza próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- user_roles
CREATE POLICY "Usuário vê próprios papéis"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admin vê todos os papéis"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gerencia papéis"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- produtos
CREATE POLICY "Qualquer um vê produtos ativos"
  ON public.produtos FOR SELECT
  USING (ativo = true);
CREATE POLICY "Admin vê todos os produtos"
  ON public.produtos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gerencia produtos"
  ON public.produtos FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- pedidos
CREATE POLICY "Cliente vê próprios pedidos"
  ON public.pedidos FOR SELECT
  USING (auth.uid() = usuario_id);
CREATE POLICY "Admin vê todos os pedidos"
  ON public.pedidos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente cria pedido próprio"
  ON public.pedidos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Admin atualiza pedidos"
  ON public.pedidos FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- itens_pedido
CREATE POLICY "Cliente vê itens dos próprios pedidos"
  ON public.itens_pedido FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.pedidos p WHERE p.id = pedido_id AND p.usuario_id = auth.uid()));
CREATE POLICY "Admin vê todos os itens"
  ON public.itens_pedido FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente insere itens do próprio pedido"
  ON public.itens_pedido FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos p WHERE p.id = pedido_id AND p.usuario_id = auth.uid()));

-- =========================================
-- STORAGE: bucket público para imagens de produto
-- =========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true);

CREATE POLICY "Imagens de produtos públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'produtos');
CREATE POLICY "Admin faz upload de imagens"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin atualiza imagens"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin remove imagens"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
