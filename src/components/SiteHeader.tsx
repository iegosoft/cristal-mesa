import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo-vieira-decor.png";

const links = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" aria-label={SITE_NAME} className="flex items-center">
          <img
            src={logo}
            alt={`${SITE_NAME} — logo`}
            className="h-14 w-auto md:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-light tracking-wide text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          <Link to="/carrinho" className="relative rounded-full p-2 text-foreground hover:text-primary" aria-label="Carrinho">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-accent"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)]"
            >
              <User className="h-3.5 w-3.5" /> Entrar
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Link to="/carrinho" className="relative rounded-md p-2 text-foreground" aria-label="Carrinho">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Abrir menu"
            className="rounded-md p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background md:hidden">
          <div className="flex flex-col px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-light text-foreground"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-4">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> Painel Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-medium uppercase tracking-wider text-secondary-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sair
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground"
                >
                  <User className="h-3.5 w-3.5" /> Entrar / Cadastrar
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
