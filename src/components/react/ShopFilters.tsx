import React, { useEffect, useMemo, useState } from "react";
import { PriceSlider } from "./PriceSlider";
import { useTranslation } from "./useTranslation";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface ShopFiltersProps {
  products: Product[];
  onFilter: (items: Product[]) => void;
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({ products, onFilter }) => {
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products]);
  const [selected, setSelected] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(() => Math.ceil(Math.max(...products.map((p) => p.price))));
  const { t } = useTranslation();

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchCategory = selected === "All" || product.category === selected;
      const matchPrice = product.price <= maxPrice;
      return matchCategory && matchPrice;
    });
    onFilter(filtered);
  }, [selected, maxPrice, products, onFilter]);

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <fieldset>
        <legend className="text-sm font-semibold">{t("filters.category")}</legend>
        <div className="mt-2 space-y-2">
          {['All', ...categories].map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selected === category}
                onChange={() => setSelected(category)}
              />
              {category === "All" ? t("filters.all") : category}
            </label>
          ))}
        </div>
      </fieldset>
      <PriceSlider
        min={Math.min(...products.map((product) => product.price))}
        max={Math.max(...products.map((product) => product.price))}
        value={maxPrice}
        onChange={setMaxPrice}
      />
    </aside>
  );
};
