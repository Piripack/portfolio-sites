import React from "react";
import { useCart } from "./CartContext";
import { useTranslation } from "./useTranslation";

interface CartTriggerProps {
  onOpen: () => void;
  open: boolean;
}

export const CartTrigger: React.FC<CartTriggerProps> = ({ onOpen, open }) => {
  const { state, subtotal } = useCart();
  const { t } = useTranslation();
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
  return (
    <button
      onClick={onOpen}
      className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
      aria-haspopup="dialog"
      aria-expanded={open}
    >
      <span aria-hidden="true">🛒</span>
      <span>{t("cart.trigger")}</span>
      <span className="sr-only">{t("cart.open")}</span>
      <span className="rounded-full bg-white/20 px-2 text-xs">{itemCount}</span>
      <span className="text-xs text-white/70">£{subtotal.toFixed(2)}</span>
    </button>
  );
};
