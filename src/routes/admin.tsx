import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, LayoutDashboard, Package, ShoppingCart, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    // login admin tem rota própria; permite acesso
    if (location.pathname === "/admin/login") return;
    if (!user) {
      navigate({ to: "/admin/login" });
      return;
    }
    if (!isAdmin) {
      navigate({ to: "/" });
    }
  }, [user, isAdmin, loading, navigate, location.pathname]);

  // Tela de login do admin não usa layout
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Painel</span>
          <h1 className="font-serif text-3xl text-foreground">Administração</h1>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Ver site
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-light text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
