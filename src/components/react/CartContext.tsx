import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  vatRate: number;
  image: string;
  stock: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  version: number;
};

type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "remove"; id: string }
  | { type: "update"; id: string; quantity: number }
  | { type: "reset" };

const STORAGE_KEY = "portfolio-sites:cart:v1";
const initialState: CartState = { items: [], version: 1 };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((item) => item.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.item.id
              ? {
                  ...item,
                  quantity: Math.min(item.stock, item.quantity + action.item.quantity),
                }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case "remove": {
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    }
    case "update": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? {
                ...item,
                quantity: Math.max(1, Math.min(item.stock, action.quantity)),
              }
            : item
        ),
      };
    }
    case "reset":
      return initialState;
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    if (typeof window === "undefined") return initialState;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialState;
      const parsed = JSON.parse(raw) as CartState;
      if (parsed.version !== initialState.version) return initialState;
      return parsed;
    } catch (error) {
      console.warn("Failed to load cart", error);
      return initialState;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      addToCart: (item: Omit<CartItem, "quantity">, quantity = 1) =>
        dispatch({ type: "add", item: { ...item, quantity: Math.min(item.stock, quantity) } }),
      removeFromCart: (id: string) => dispatch({ type: "remove", id }),
      updateQuantity: (id: string, quantity: number) => dispatch({ type: "update", id, quantity }),
      clearCart: () => dispatch({ type: "reset" }),
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  const { state } = context;
  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const vatTotal = state.items.reduce((total, item) => total + item.price * item.quantity * item.vatRate, 0);
  const total = subtotal + vatTotal;
  return { ...context, subtotal, vatTotal, total };
}
