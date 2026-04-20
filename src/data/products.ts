import crystal from "@/assets/product-crystal.jpg";
import porcelain from "@/assets/product-porcelain.jpg";
import glass from "@/assets/product-glass.jpg";
import centerpiece from "@/assets/product-centerpiece.jpg";

export type Product = {
  id: string;
  name: string;
  category: "Cristal" | "Porcelana" | "Vidro" | "Mesa Posta";
  price: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "taca-cristal-borda-dourada",
    name: "Taça Cristal Borda Dourada",
    category: "Cristal",
    price: "R$ 189,00",
    description: "Conjunto com 6 taças de cristal lapidado com borda em ouro 24k.",
    image: crystal,
  },
  {
    id: "jogo-porcelana-floral",
    name: "Jogo Porcelana Floral",
    category: "Porcelana",
    price: "R$ 459,00",
    description: "Aparelho de jantar em porcelana fina com filete dourado, 20 peças.",
    image: porcelain,
  },
  {
    id: "bowls-vidro-lapidado",
    name: "Bowls Vidro Lapidado",
    category: "Vidro",
    price: "R$ 129,00",
    description: "Par de bowls em vidro trabalhado, perfeitos para sobremesas e entradas.",
    image: glass,
  },
  {
    id: "centro-de-mesa-romantico",
    name: "Centro de Mesa Romântico",
    category: "Mesa Posta",
    price: "R$ 329,00",
    description: "Composição completa com castiçais, vaso e detalhes em dourado envelhecido.",
    image: centerpiece,
  },
  {
    id: "taca-champagne-cristal",
    name: "Taça Champagne Cristal",
    category: "Cristal",
    price: "R$ 219,00",
    description: "Conjunto com 6 taças flûte em cristal puro para brindes especiais.",
    image: crystal,
  },
  {
    id: "pratos-rasos-dourados",
    name: "Pratos Rasos Borda Ouro",
    category: "Porcelana",
    price: "R$ 269,00",
    description: "Conjunto com 6 pratos rasos em porcelana branca com borda em ouro.",
    image: porcelain,
  },
];
