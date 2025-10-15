import React, { useEffect, useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { CartTrigger } from "./CartTrigger";
import { LangSwitcher } from "./LangSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTranslation } from "./useTranslation";

const links = [
  { href: "/portfolio-sites/", key: "nav.overview" },
  { href: "/portfolio-sites/demos/service-business/", key: "nav.rapidfix" },
  { href: "/portfolio-sites/demos/restaurant/", key: "nav.laterra" },
  { href: "/portfolio-sites/demos/personal-brand/", key: "nav.careerlift" },
  { href: "/portfolio-sites/demos/online-store/", key: "nav.nordic" },
  { href: "/portfolio-sites/demos/agency/", key: "nav.ramos" },
  { href: "/portfolio-sites/demos/online-store/bag/", key: "nav.bag" }
];

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setHidden(current > 120 && current > lastScrollY);
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white/80 shadow-sm backdrop-blur transition-transform duration-300 dark:bg-neutral-900/80 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
          <div className="flex items-center gap-6">
            <a className="text-lg font-semibold text-primary" href="/portfolio-sites/">
              {t("site.name")}
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-4 text-sm font-medium md:flex">
              {links.map((link) => (
                <a key={link.href} className="rounded-full px-3 py-1 hover:bg-primary/10" href={link.href}>
                  {t(link.key)}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-4">
            <LangSwitcher />
            <ThemeSwitcher />
            <CartTrigger onOpen={() => setDrawerOpen(true)} open={drawerOpen} />
          </div>
        </div>
      </header>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <button
        className={`fixed bottom-32 right-4 z-30 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg transition ${
          showBackToTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t("action.backToTop")}
      >
        {t("action.backToTop")}
      </button>
    </>
  );
};
