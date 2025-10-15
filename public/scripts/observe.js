const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal() {
  if (prefersReducedMotion) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, {
    threshold: 0.15
  });

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    observer.observe(el);
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initReveal);
}
