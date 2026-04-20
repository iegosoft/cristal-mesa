import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export type CartItem = {
  id: string;
  nome: string;
  preco: number;
  imagem_url: string | null;
  quantidade: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "quantidade">, qty?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_PREFIX = "mesa-cristal-cart:";
const GUEST_KEY = `${STORAGE_PREFIX}guest`;

function storageKey(userId: string | null | undefined) {
  return userId ? `${STORAGE_PREFIX}${userId}` : GUEST_KEY;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const currentKeyRef = useRef<string | null>(null);
  const hydratedKeyRef = useRef<string | null>(null);

  // Carrega o carrinho correspondente ao usuário (ou guest) sempre que o user mudar
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading) return;

    const key = storageKey(user?.id);
    currentKeyRef.current = key;
    hydratedKeyRef.current = null;
    setItems([]);

    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }

    hydratedKeyRef.current = key;
  }, [user?.id, loading]);

  // Persiste apenas no carrinho do usuário atualmente carregado
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading) return;
    const key = currentKeyRef.current;
    if (!key) return;
    if (hydratedKeyRef.current !== key) return;
    // Garante que estamos escrevendo na chave do usuário atual
    if (key !== storageKey(user?.id)) return;
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, user?.id, loading]);

  const add: CartContextValue["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantidade: i.quantidade + qty } : i));
      }
      return [...prev, { ...item, quantidade: qty }];
    });
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const setQuantity = (id: string, qty: number) => {
    if (qty <= 0) return remove(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantidade: qty } : i)));
  };

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantidade, 0);
  const total = items.reduce((s, i) => s + i.preco * i.quantidade, 0);

  return (
    <CartContext.Provider value={{ items, count, total, add, remove, setQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
