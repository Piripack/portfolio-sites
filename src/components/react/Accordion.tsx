import React, { useState } from "react";

interface Item {
  question: string;
  answer: string;
}

export const Accordion: React.FC<{ items: Item[] }> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <button
              className="flex w-full items-center justify-between text-left text-lg font-semibold"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{item.question}</span>
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
};
