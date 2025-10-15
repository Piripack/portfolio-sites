import React from "react";
import { useTranslation } from "./useTranslation";

interface PriceSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export const PriceSlider: React.FC<PriceSliderProps> = ({ min, max, value, onChange }) => {
  const { t } = useTranslation();
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span>
        {t("filters.maxBudget")} £{value}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-primary"
      />
    </label>
  );
};
