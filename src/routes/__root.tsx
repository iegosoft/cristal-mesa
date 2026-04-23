import { Outlet, Link, createRootRoute, useMatches } from "@tanstack/react-router";
import { useEffect } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-foreground">404</h1>
        <h2 className="mt-4 font-serif text-xl text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[var(--rose-deep)]"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: "Vieira Decor — Mesa posta, louças e cristais" },
      {
        name: "description",
        content:
          "Louças de vidro, cristais e mesa posta para encantar seus momentos especiais. Conheça o catálogo e compre online.",
      },
      { name: "author", content: "Vieira Decor" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

type MetaTag = Record<string, string>;

/**
 * Sincroniza <title> e <meta> com base nas rotas ativas.
 * Em SPA, atualizamos document.title e tags meta no client a cada navegação.
 */
function RouteHead() {
  const matches = useMatches();

  useEffect(() => {
    const allMeta: MetaTag[] = matches.flatMap(
      (m) => ((m as { meta?: MetaTag[] }).meta as MetaTag[] | undefined) ?? [],
    );

    // Title: pega o último definido (mais específico)
    const titleEntry = [...allMeta].reverse().find((m) => "title" in m);
    if (titleEntry?.title) {
      document.title = titleEntry.title;
    }

    // Atualiza meta tags gerenciadas (marcadas com data-route-meta)
    const head = document.head;
    head.querySelectorAll("meta[data-route-meta]").forEach((el) => el.remove());

    allMeta
      .filter((m) => !("title" in m))
      .forEach((m) => {
        const el = document.createElement("meta");
        Object.entries(m).forEach(([k, v]) => el.setAttribute(k, v));
        el.setAttribute("data-route-meta", "");
        head.appendChild(el);
      });
  }, [matches]);

  return null;
}

function RootComponent() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <RouteHead />
          <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
            <WhatsAppFloat />
            <Toaster />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
