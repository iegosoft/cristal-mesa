import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { CONTACT_EMAIL, INSTAGRAM, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Mesa & Cristal" },
      {
        name: "description",
        content: "Fale com a Mesa & Cristal pelo WhatsApp, e-mail ou Instagram.",
      },
      { property: "og:title", content: "Contato — Mesa & Cristal" },
      {
        property: "og:description",
        content: "Estamos prontos para conversar sobre sua próxima mesa posta.",
      },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome").max(80, "Máximo 80 caracteres"),
  message: z.string().trim().min(5, "Conte um pouco mais").max(500, "Máximo 500 caracteres"),
});

function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = contactSchema.safeParse({ name, message });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Verifique os dados");
      return;
    }
    setError(null);
    const text = `Olá! Meu nome é ${result.data.name}. ${result.data.message}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="mb-12 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Contato</span>
        <h1 className="mt-2 font-serif text-4xl text-foreground md:text-6xl">Vamos conversar</h1>
        <p className="mx-auto mt-4 max-w-xl text-base font-light text-muted-foreground">
          Conte sobre o que está procurando — uma peça especial, um presente ou uma mesa completa.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]"
        >
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Seu nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-light text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Como podemos te chamar?"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Mensagem
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm font-light text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Conte sobre o que procura..."
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[var(--rose-deep)]"
          >
            <MessageCircle className="h-4 w-4" /> Enviar pelo WhatsApp
          </button>
        </form>

        {/* Info */}
        <div className="space-y-5">
          <a
            href={whatsappLink("Olá! Vim pelo site.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-lg text-foreground">WhatsApp</p>
              <p className="text-sm font-light text-muted-foreground">Resposta rápida e atendimento personalizado</p>
            </div>
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-lg text-foreground">E-mail</p>
              <p className="text-sm font-light text-muted-foreground">{CONTACT_EMAIL}</p>
            </div>
          </a>
          <a
            href={`https://instagram.com/${INSTAGRAM.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-lg text-foreground">Instagram</p>
              <p className="text-sm font-light text-muted-foreground">{INSTAGRAM}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
