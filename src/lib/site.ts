// Atualize aqui o número de WhatsApp e dados de contato.
// Formato internacional sem espaços/símbolos (ex: 5511999999999)

export const WHATSAPP_NUMBER = "5592993960786";
export const SITE_NAME = "Vieira Decor";
>>>>>>> 0737c188df8b3de7a66c7e46c1988699d0c0b2ce
export const SITE_TAGLINE = "Mesa posta, louças e cristais para encantar";
export const CONTACT_EMAIL = "contato@vieiradecor.com.br";
export const INSTAGRAM = "@vieiradecor";

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
