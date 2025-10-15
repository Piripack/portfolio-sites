import React, { useEffect, useRef, useState } from "react";
import { createFocusTrap } from "focus-trap";

interface LightboxProps {
  images: { src: string; alt: string }[];
}

export const Lightbox: React.FC<LightboxProps> = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const trap = createFocusTrap(containerRef.current, { escapeDeactivates: true, clickOutsideDeactivates: true });
    trap.activate();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setIndex((prev) => (prev + 1) % images.length);
      } else if (event.key === "ArrowLeft") {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      trap.deactivate();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, images.length]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, idx) => (
          <button
            key={image.src}
            className="group relative overflow-hidden rounded-2xl"
            onClick={() => {
              setIndex(idx);
              setOpen(true);
            }}
          >
            <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            <span className="absolute inset-0 bg-black/40 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
            <span className="sr-only">View {image.alt}</span>
          </button>
        ))}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery viewer"
        >
          <div className="relative max-w-4xl" ref={containerRef}>
            <img src={images[index].src} alt={images[index].alt} className="max-h-[80vh] w-full rounded-3xl object-contain" />
            <p className="mt-2 text-center text-white">{images[index].alt}</p>
            <div className="mt-4 flex justify-between text-white">
              <button className="rounded-full bg-white/10 px-4 py-2" onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)}>
                Previous
              </button>
              <button className="rounded-full bg-white/10 px-4 py-2" onClick={() => setIndex((prev) => (prev + 1) % images.length)}>
                Next
              </button>
              <button className="rounded-full bg-rose-500 px-4 py-2" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
