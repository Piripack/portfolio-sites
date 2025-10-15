import React, { useEffect, useState } from "react";

interface Slide {
  quote: string;
  name: string;
  role: string;
}

export const Carousel: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative rounded-3xl bg-primary/10 p-6" role="region" aria-label="Testimonials">
      <blockquote className="text-lg font-semibold text-primary">
        “{slides[index].quote}”
      </blockquote>
      <p className="mt-4 text-sm text-neutral-600">
        <span className="font-semibold text-neutral-900">{slides[index].name}</span> — {slides[index].role}
      </p>
      <div className="mt-6 flex items-center gap-2">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            className={`h-2 w-6 rounded-full ${index === dotIndex ? "bg-primary" : "bg-primary/30"}`}
            aria-label={`Show testimonial ${dotIndex + 1}`}
            aria-current={index === dotIndex}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </div>
  );
};
