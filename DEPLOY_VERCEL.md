# Deploy na Vercel

Este projeto está pronto para deploy na Vercel mantendo TanStack Start + SSR + Supabase.

## Passos

1. **Importar o repositório na Vercel** (Add New → Project → seu repo do GitHub).
2. A Vercel detecta o `vercel.json` automaticamente. Não precisa configurar nada manualmente — o `buildCommand` já usa `DEPLOY_TARGET=vercel npm run build`, que faz o TanStack Start gerar o output no formato Vercel (serverless + static).
3. **Adicionar as variáveis de ambiente** no painel da Vercel (Settings → Environment Variables):

   - `VITE_SUPABASE_URL` = `https://hilvjcovdyvshqydymbc.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = (mesma chave do `.env`)
   - `VITE_SUPABASE_PROJECT_ID` = `hilvjcovdyvshqydymbc`
   - `SUPABASE_URL` = `https://hilvjcovdyvshqydymbc.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = (mesma chave do `.env`)

4. Clicar em **Deploy**. Pronto.

## Como funciona

- Em desenvolvimento e no Lovable, o build continua usando Cloudflare (default).
- Quando a Vercel roda o build, a variável `DEPLOY_TARGET=vercel` ativa o adapter oficial Vercel do TanStack Start, gerando automaticamente as serverless functions e os assets estáticos no formato esperado pela plataforma.
- O Supabase continua funcionando normalmente — todas as chamadas são client-side.
