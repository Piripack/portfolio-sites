import React, { useState } from "react";
import { ShopFilters } from "./ShopFilters";
import { useCart } from "./CartContext";
import { useToast } from "./Toast";
import { useTranslation } from "./useTranslation";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  vatRate: number;
  stock: number;
  image: string;
};

export const ShopView: React.FC<{ products: Product[] }> = ({ products }) => {
  const [filtered, setFiltered] = useState(products);
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <ShopFilters products={products} onFilter={setFiltered} />
      <div className="grid gap-6 sm:grid-cols-2">
        {filtered.map((product) => (
          <article key={product.id} className="rounded-3xl bg-white p-6 shadow-md dark:bg-neutral-900" data-reveal>
            <img src={product.image} alt="" className="h-48 w-full rounded-2xl object-cover" loading="lazy" />
            <h3 className="mt-4 text-xl font-semibold">{product.name}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">£{product.price.toFixed(2)} {t("shop.incVat")}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-primary">
              {product.stock > 10
                ? t("shop.inStock")
                : product.stock > 0
                ? `${t("shop.lowStock")}${product.stock ? ` (${product.stock})` : ""}`
                : t("shop.soldOut")}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
                href={`/portfolio-sites/product/${product.id}/`}
              >
                {t("action.viewDetail")}
              </a>
              <button
                className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      vatRate: product.vatRate,
                      image: product.image,
                      stock: product.stock,
                    },
                    1
                  );
                  addToast(t("toast.added"));
                }}
              >
                {t("action.addToBag")}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
