import React, { useMemo, useState } from "react";
import { useTranslation } from "./useTranslation";

type Course = "breakfast" | "lunch" | "dinner";

interface MenuItem {
  name: string;
  course: Course;
  price: number;
  description: string;
}

export const RestaurantMenu: React.FC<{ items: MenuItem[] }> = ({ items }) => {
  const [course, setCourse] = useState<Course | "all">("all");
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCourse = course === "all" || item.course === course;
      const matchQuery = item.name.toLowerCase().includes(query.toLowerCase());
      return matchCourse && matchQuery;
    });
  }, [course, query, items]);

  const courseLabel = (value: Course | "all") => {
    if (value === "all") return t("filters.all");
    return t(`menu.course.${value}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          {["all", "breakfast", "lunch", "dinner"].map((option) => (
            <button
              key={option}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${course === option ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}
              onClick={() => setCourse(option as Course | "all")}
              type="button"
            >
              {courseLabel(option as Course | "all")}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only">{t("menu.search")}</span>
          <input
            type="search"
            placeholder={t("menu.searchPlaceholder")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-full border border-neutral-300 px-4 py-2 md:w-64"
          />
        </label>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <li key={item.name} className="rounded-3xl bg-white p-6 shadow-md dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span className="text-sm font-semibold text-primary">£{item.price.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{item.description}</p>
            <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">{courseLabel(item.course)}</span>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p className="text-sm text-neutral-600">{t("menu.empty")}</p>}
    </div>
  );
};
