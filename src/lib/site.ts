// Atualize aqui o número de WhatsApp e dados de contato.
// Formato internacional sem espaços/símbolos (ex: 5511999999999)

export const WHATSAPP_NUMBER = "5592984460575";
export const SITE_NAME = "Vieira Decor";
export const SITE_TAGLINE = "Mesa posta, louças e cristais para encantar";
export const CONTACT_EMAIL = "contatovieiradecor@gmail.com";
export const INSTAGRAM = "@vieiradecor_";

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
