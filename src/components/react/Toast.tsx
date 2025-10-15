import React, { createContext, useContext, useEffect, useState } from "react";

type Toast = {
  id: number;
  message: string;
};

const ToastContext = createContext<{
  addToast: (message: string) => void;
} | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
