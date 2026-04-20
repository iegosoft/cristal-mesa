import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin — Mesa & Cristal" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { user, isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (loading) return;
    if (user && isAdmin) navigate({ to: "/admin/dashboard" });
    else if (user && !isAdmin) toast.error("Esta conta não tem acesso administrativo");
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(form.email, form.password);
    if (error) toast.error(error === "Invalid login credentials" ? "Email ou senha incorretos" : error);
    setSubmitting(false);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md items-center px-6 py-16">
      <div className="w-full rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
        <header className="mb-6 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Restrito</span>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Acesso administrativo</h1>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Senha</span>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </button>
        </form>
      </div>
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid var(--border);background:var(--background);padding:0.75rem 1rem;font-size:0.875rem;font-weight:300;color:var(--foreground);outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}
