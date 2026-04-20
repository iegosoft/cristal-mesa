# Mesa & Cristal — E-commerce de Mesa Posta, Louças e Cristais

Sistema completo de e-commerce com catálogo público, carrinho, checkout via WhatsApp e painel administrativo protegido por login.

> Construído com **TanStack Start (React 19 + Vite 7)**, **Tailwind CSS v4**, **shadcn/ui** e **Lovable Cloud (Supabase)** como backend (Banco de Dados, Autenticação e Storage).

---

## 📋 Sumário

- [Pré-requisitos](#-pré-requisitos)
- [Como abrir no VS Code](#-como-abrir-no-vs-code)
- [Variáveis de ambiente](#-variáveis-de-ambiente-env)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Arquitetura](#-arquitetura)
- [Fluxo de dados](#-fluxo-de-dados)
- [Como criar o primeiro Admin](#-como-criar-o-primeiro-admin)
- [Manutenção](#-manutenção)
- [Solução de problemas](#-solução-de-problemas)

---

## ✅ Pré-requisitos

Instale antes de começar:

| Ferramenta | Versão recomendada | Link |
|---|---|---|
| **Node.js** | 20 LTS ou superior | https://nodejs.org |
| **Bun** (recomendado) ou npm | Bun 1.1+ / npm 10+ | https://bun.sh |
| **Git** | qualquer versão recente | https://git-scm.com |
| **VS Code** | atual | https://code.visualstudio.com |

### Extensões recomendadas no VS Code

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **TypeScript and JavaScript Language Features** (já vem nativo)

---

## 🚀 Como abrir no VS Code

### 1. Clone (ou baixe) o repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO> mesa-cristal
cd mesa-cristal
```

> Se baixou via GitHub do Lovable, basta abrir a pasta no VS Code: **File → Open Folder…**

### 2. Instale as dependências

Com **Bun** (recomendado, é o que o projeto usa):

```bash
bun install
```

Ou com **npm**:

```bash
npm install
```

### 3. Configure o arquivo `.env`

O projeto usa o **Lovable Cloud** (Supabase) já provisionado. Crie um arquivo `.env` na raiz com o seguinte conteúdo (os valores já existentes no projeto da nuvem):

```env
VITE_SUPABASE_URL="https://hilvjcovdyvshqydymbc.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpbHZqY292ZHl2c2hxeWR5bWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTU1NDksImV4cCI6MjA5MjI3MTU0OX0.kg29tGJGslENvbENRxv7-GDh6_QSQz5JE9lm94je7xo"
VITE_SUPABASE_PROJECT_ID="hilvjcovdyvshqydymbc"
SUPABASE_URL="https://hilvjcovdyvshqydymbc.supabase.co"
SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpbHZqY292ZHl2c2hxeWR5bWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTU1NDksImV4cCI6MjA5MjI3MTU0OX0.kg29tGJGslENvbENRxv7-GDh6_QSQz5JE9lm94je7xo"
```

> ⚠️ Não comite o `.env` (ele já está no `.gitignore`).
> 🔒 Esta é uma chave **publishable/anon** — pode ser exposta no frontend, pois a segurança é garantida pelas políticas RLS no banco.

### 4. Rode o projeto

```bash
bun run dev
```

ou

```bash
npm run dev
```

Abra http://localhost:8080 (ou a porta que aparecer no terminal).

---

## 🔐 Variáveis de ambiente (.env)

| Variável | Para quê serve |
|---|---|
| `VITE_SUPABASE_URL` | URL do backend (usada no client) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública anônima (usada no client) |
| `VITE_SUPABASE_PROJECT_ID` | ID do projeto |
| `SUPABASE_URL` | URL do backend (usada no SSR) |
| `SUPABASE_PUBLISHABLE_KEY` | Chave pública anônima (usada no SSR) |

---

## 📜 Scripts disponíveis

| Comando | O que faz |
|---|---|
| `bun run dev` | Inicia o servidor de desenvolvimento (HMR) |
| `bun run build` | Build de produção |
| `bun run start` | Roda o build de produção localmente |
| `bun run lint` | Roda o ESLint |

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND (React)                       │
│                                                              │
│  ┌─────────────────────┐      ┌────────────────────────┐   │
│  │   ÁREA PÚBLICA      │      │  ÁREA ADMIN (/admin/*) │   │
│  │                     │      │   protegida por login  │   │
│  │  /                  │      │                        │   │
│  │  /produtos          │      │  /admin/login          │   │
│  │  /produto/:id       │      │  /admin/dashboard      │   │
│  │  /carrinho          │      │  /admin/produtos       │   │
│  │  /checkout          │      │  /admin/produtos/novo  │   │
│  │  /sobre, /contato   │      │  /admin/produtos/:id   │   │
│  │  /login             │      │  /admin/pedidos        │   │
│  └──────────┬──────────┘      └───────────┬────────────┘   │
│             │                              │                │
└─────────────┼──────────────────────────────┼────────────────┘
              │                              │
              ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│              LOVABLE CLOUD (Supabase)                       │
│                                                              │
│  ┌───────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │ Database  │  │   Auth   │  │  Storage  │  │   RLS   │  │
│  │ Postgres  │  │ Email/Pw │  │  imagens  │  │ Policies│  │
│  └───────────┘  └──────────┘  └───────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de pastas

```
src/
├── routes/                 # Rotas (file-based routing do TanStack Router)
│   ├── __root.tsx          # Layout raiz (Header/Footer/Providers)
│   ├── index.tsx           # Home pública
│   ├── produtos.tsx        # Catálogo
│   ├── produto.$id.tsx     # Detalhe do produto
│   ├── carrinho.tsx        # Carrinho
│   ├── checkout.tsx        # Checkout (login obrigatório → WhatsApp)
│   ├── login.tsx           # Login/cadastro do cliente
│   ├── admin.tsx           # Layout do admin + guarda de rota
│   ├── admin.login.tsx     # Login do administrador
│   ├── admin.dashboard.tsx # Métricas
│   ├── admin.produtos.*    # CRUD de produtos
│   └── admin.pedidos.tsx   # Gestão de pedidos
├── components/
│   ├── SiteHeader.tsx, SiteFooter.tsx, WhatsAppFloat.tsx
│   ├── ProductCard.tsx
│   ├── admin/ProdutoForm.tsx
│   └── ui/                 # shadcn/ui
├── lib/
│   ├── auth.tsx            # AuthProvider + hook useAuth (sessão + isAdmin)
│   ├── cart.tsx            # CartProvider + hook useCart
│   ├── site.ts             # ⭐ Dados da marca (WhatsApp, Instagram, e-mail)
│   └── utils.ts
├── integrations/supabase/
│   ├── client.ts           # ⛔ NÃO EDITAR (auto-gerado)
│   ├── client.server.ts    # ⛔ NÃO EDITAR (auto-gerado)
│   └── types.ts            # ⛔ NÃO EDITAR (auto-gerado)
└── styles.css              # Tailwind v4 + design tokens (oklch)

supabase/
├── config.toml
└── migrations/             # ⛔ Histórico do banco — não editar manualmente
```

### Banco de dados

| Tabela | O que guarda |
|---|---|
| `profiles` | Dados do cliente (nome, telefone, endereço) — vinculado ao `auth.users` |
| `user_roles` | Papel do usuário: `admin` ou `cliente` |
| `produtos` | Catálogo (nome, descrição, preço, estoque, imagem, ativo, categoria) |
| `pedidos` | Pedidos com cliente, total, status |
| `itens_pedido` | Itens de cada pedido (produto, quantidade, preço) |

**Segurança (RLS — Row Level Security):**
- Cliente só vê **seus próprios** pedidos.
- Admin vê tudo.
- Apenas admin cria/edita/exclui produtos.
- Função `has_role(user_id, 'admin')` no banco evita recursão e privilege escalation.

---

## 🔄 Fluxo de dados

### Cliente compra um produto
```
1. Cliente entra em /produtos      →  SELECT produtos WHERE ativo = true
2. Adiciona ao carrinho            →  Estado local (CartProvider) + localStorage
3. Vai para /checkout              →  Exige login (redireciona p/ /login se não logado)
4. Confirma pedido                 →  INSERT pedidos + INSERT itens_pedido
5. Abre WhatsApp                   →  Mensagem pré-formatada com itens, total e endereço
```

### Admin cadastra produto
```
1. Admin loga em /admin/login           →  Auth + verifica role 'admin'
2. /admin/produtos/novo                 →  Formulário
3. Faz upload da imagem                 →  Storage bucket "produtos"
4. Salva                                →  INSERT produtos
5. Site público atualiza automaticamente →  Próximo SELECT já traz o novo produto
```

---

## 👤 Como criar o primeiro Admin

O sistema está configurado para que **o primeiro usuário cadastrado vire admin automaticamente** (via trigger SQL no banco).

1. Rode o projeto (`bun run dev`).
2. Acesse `/login` e clique em **Criar conta**.
3. Cadastre seu e-mail e senha → você é o admin.
4. Acesse `/admin/dashboard`.

Para promover outro usuário a admin depois, insira manualmente no banco:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<UUID_DO_USUARIO>', 'admin');
```

---

## 🛠 Manutenção

### Personalizar marca, WhatsApp e contatos
Edite **`src/lib/site.ts`** com seus dados reais (telefone do WhatsApp, Instagram, e-mail, nome da loja).

### Ajustar cores, fontes e estilo
Edite **`src/styles.css`** — todos os tokens (`--primary`, `--background`, etc.) usam `oklch` e são consumidos pelos componentes via Tailwind.

### Adicionar uma nova página pública
Crie um arquivo em `src/routes/`. Exemplo: `src/routes/promocoes.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/promocoes")({
  component: () => <div>Promoções</div>,
});
```
Pronto — a rota `/promocoes` já existe (o `routeTree.gen.ts` é gerado automaticamente).

### Backup do banco
Pelo painel do Lovable Cloud → **Cloud → Database → Tables → Export**.

---

## 🐞 Solução de problemas

| Problema | Solução |
|---|---|
| `Missing Supabase environment variables` | Verifique se o `.env` existe na raiz e tem as 5 variáveis |
| Tela branca / erro de import | Rode `bun install` novamente |
| Porta 8080 ocupada | Pare o processo: `lsof -ti:8080 \| xargs kill -9` |
| `404` ao navegar para uma rota nova | Pare o servidor e rode `bun run dev` de novo (regenera o routeTree) |
| Não consigo entrar em `/admin` | Verifique se o usuário tem role `admin` na tabela `user_roles` |
| Imagens dos produtos não aparecem | Verifique se o bucket `produtos` está como **público** no Storage |
| Erro de TypeScript em `types.ts` | Esse arquivo é auto-gerado — não edite. Rode `bun install` |

---

## 📚 Tecnologias

- **TanStack Start v1** — full-stack React 19 framework com SSR
- **Vite 7** — build tool
- **Tailwind CSS v4** — estilização (config nativa via `@import` no CSS)
- **shadcn/ui** + **Radix UI** — componentes acessíveis
- **TanStack Router** — roteamento type-safe baseado em arquivos
- **Supabase JS** — cliente do Lovable Cloud
- **Sonner** — toasts
- **Lucide React** — ícones

---

## 📄 Licença

Projeto privado — Mesa & Cristal.
