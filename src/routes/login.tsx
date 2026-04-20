import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/",
  }),
  head: () => ({ meta: [{ title: "Entrar — Mesa & Cristal" }] }),
  component: LoginPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signUpSchema = signInSchema.extend({
  nome: z.string().trim().min(2, "Informe seu nome").max(120),
  telefone: z.string().trim().max(30).optional(),
});

function LoginPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", nome: "", telefone: "" });

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: search.redirect as "/" });
    }
  }, [user, loading, navigate, search.redirect]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (mode === "signin") {
      const parsed = signInSchema.safeParse(form);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0].message);
        setSubmitting(false);
        return;
      }
      const { error } = await signIn(parsed.data.email, parsed.data.password);
      if (error) toast.error(error === "Invalid login credentials" ? "Email ou senha incorretos" : error);
      else toast.success("Bem-vinda de volta!");
    } else {
      const parsed = signUpSchema.safeParse(form);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0].message);
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(parsed.data.email, parsed.data.password, parsed.data.nome, parsed.data.telefone);
      if (error) {
        if (error.includes("already registered")) toast.error("Este email já está cadastrado");
        else toast.error(error);
      } else toast.success("Conta criada! Você já está logada.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md items-center px-6 py-16">
      <div className="w-full rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
        <header className="mb-6 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {mode === "signin" ? "Acesso" : "Cadastro"}
          </span>
          <h1 className="mt-2 font-serif text-3xl text-foreground">
            {mode === "signin" ? "Entrar" : "Criar conta"}
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <Field label="Nome">
                <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="input" />
              </Field>
              <Field label="Telefone (opcional)">
                <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className="input" />
              </Field>
            </>
          )}
          <Field label="Email">
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </Field>
          <Field label="Senha">
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-[var(--rose-deep)] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>

        <p className="mt-6 text-center text-xs font-light text-muted-foreground">
          <Link to="/" className="hover:text-primary">← Voltar ao início</Link>
        </p>
      </div>
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid var(--border);background:var(--background);padding:0.75rem 1rem;font-size:0.875rem;font-weight:300;color:var(--foreground);outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
