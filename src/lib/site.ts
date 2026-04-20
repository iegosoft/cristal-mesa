// Atualize aqui o número de WhatsApp e dados de contato.
// Formato internacional sem espaços/símbolos (ex: 5511999999999)
export const WHATSAPP_NUMBER = "5592993960786";
export const SITE_NAME = "Mesa & Cristal";
export const SITE_TAGLINE = "Mesa posta, louças e cristais para encantar";
export const CONTACT_EMAIL = "contato@mesaecristal.com.br";
export const INSTAGRAM = "@mesaecristal";

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
