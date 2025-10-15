import React from "react";
import { useCart } from "./CartContext";
import { useTranslation } from "./useTranslation";

export const BagSummary: React.FC = () => {
  const { state, subtotal, vatTotal, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {state.items.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-300">{t("cart.empty")}</p>
      ) : (
        <>
          <ul className="space-y-4">
            {state.items.map((item) => (
              <li key={item.id} className="rounded-3xl bg-white p-6 shadow-md dark:bg-neutral-900">
                <div className="flex items-start gap-4">
                  <img src={item.image} alt="" className="h-28 w-28 rounded-2xl object-cover" loading="lazy" />
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">£{item.price.toFixed(2)} • {t("cart.vat")} {Math.round(item.vatRate * 100)}%</p>
                    <label className="flex items-center gap-2 text-sm">
                      {t("cart.quantity")}
                      <input
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                        className="w-20 rounded-md border border-neutral-300 px-3 py-2"
                      />
                    </label>
                    <button className="text-sm text-rose-500 underline" onClick={() => removeFromCart(item.id)}>
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-3xl bg-primary/10 p-6 text-sm">
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
            <button className="mt-4 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white" onClick={clearCart}>
              {t("action.clearBag")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
