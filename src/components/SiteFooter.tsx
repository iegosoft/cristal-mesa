import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { CONTACT_EMAIL, INSTAGRAM, SITE_NAME, SITE_TAGLINE, whatsappLink } from "@/lib/site";
import logo from "@/assets/logo-vieira-decor.jpeg";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt={`${SITE_NAME} — logo`} className="h-12 w-12 rounded-full object-cover ring-1 ring-border" />
            <h3 className="font-serif text-2xl text-foreground">{SITE_NAME}</h3>
          </div>
          <p className="mt-3 text-sm font-light text-muted-foreground">{SITE_TAGLINE}</p>
        </div>

        <div>
          <h4 className="font-serif text-lg text-foreground">Navegação</h4>
          <ul className="mt-3 space-y-2 text-sm font-light text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Início</Link></li>
            <li><Link to="/produtos" className="hover:text-primary">Produtos</Link></li>
            <li><Link to="/sobre" className="hover:text-primary">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-primary">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-foreground">Contato</h4>
          <ul className="mt-3 space-y-3 text-sm font-light text-muted-foreground">
            <li>
              <a
                href={whatsappLink("Olá! Vi seu site e gostaria de saber mais.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${INSTAGRAM.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Instagram className="h-4 w-4" /> {INSTAGRAM}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-6 py-5 text-center text-xs font-light text-muted-foreground">
        © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
