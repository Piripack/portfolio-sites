import React, { useEffect, useRef } from "react";
import { createFocusTrap } from "focus-trap";
import { useCart } from "./CartContext";
import { useTranslation } from "./useTranslation";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { state, subtotal, vatTotal, total, updateQuantity, removeFromCart } = useCart();
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!open || !ref.current) return;
    const trap = createFocusTrap(ref.current, { escapeDeactivates: true, clickOutsideDeactivates: true });
    trap.activate();
    return () => trap.deactivate();
  }, [open]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("cart.dialogLabel")}
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-neutral-900/80 text-white shadow-2xl backdrop-blur transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col" ref={ref}>
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold">{t("cart.title")}</h2>
          <button className="rounded-full bg-white/10 px-3 py-1 text-sm" onClick={onClose}>
            {t("cart.close")}
          </button>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {state.items.length === 0 ? (
            <p className="text-sm text-neutral-200">{t("cart.empty")}</p>
          ) : (
            state.items.map((item) => (
              <article key={item.id} className="grid grid-cols-[80px_1fr] gap-4">
                <img src={item.image} alt="" width={80} height={80} className="h-20 w-20 rounded-lg object-cover" loading="lazy" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{item.name}</p>
                    <span className="text-xs uppercase tracking-wide text-lime-200">
                      {item.stock > item.quantity ? t("cart.inStock") : t("cart.limited")}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-200">£{item.price.toFixed(2)}</p>
                  <label className="mt-1 flex items-center gap-2 text-xs text-neutral-200">
                    {t("cart.quantity")}
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      className="w-16 rounded-md bg-white/10 px-2 py-1 text-white"
                    />
                  </label>
                  <button className="text-xs text-rose-200 underline" onClick={() => removeFromCart(item.id)}>
                    {t("cart.remove")}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        <footer className="space-y-2 border-t border-white/10 px-6 py-4 text-sm">
          <div className="flex justify-between">
            <span>{t("cart.subtotal")}</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("cart.vat")}</span>
            <span>£{vatTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>{t("cart.total")}</span>
            <span>£{total.toFixed(2)}</span>
          </div>
          <a href="/portfolio-sites/demos/online-store/checkout/" className="mt-4 block rounded-full bg-white py-3 text-center font-semibold text-neutral-900">
            {t("action.checkout")}
          </a>
        </footer>
      </div>
    </div>
  );
};
