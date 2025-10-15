import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useToast } from "./Toast";
import { useTranslation } from "./useTranslation";

interface Props {
  id: string;
  name: string;
  price: number;
  vatRate: number;
  image: string;
  stock: number;
}

const ProductAddButton: React.FC<Props> = ({ id, name, price, vatRate, image, stock }) => {
  const [quantity, setQuantity] = useState(() => (stock > 0 ? 1 : 0));
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { t } = useTranslation();

  return (
    <form
      className="flex flex-col gap-4 rounded-3xl bg-primary/5 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        addToCart({ id, name, price, vatRate, image, stock }, quantity);
        addToast(t("toast.added"));
      }}
    >
      <label className="flex items-center gap-3 text-sm">
        {t("cart.quantity")}
        <input
          type="number"
          min={stock > 0 ? 1 : 0}
          max={stock}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="w-20 rounded-md border border-neutral-300 px-3 py-2"
          disabled={stock === 0}
        />
      </label>
      <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white" disabled={stock === 0}>
        {t("action.addToBag")}
      </button>
    </form>
  );
};

export default ProductAddButton;
