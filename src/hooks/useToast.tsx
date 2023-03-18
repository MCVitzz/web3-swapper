import React, { createContext, useCallback, useContext, useMemo } from "react";
import { createPortal } from "react-dom";

import { Toast, ToastProps as FullProps } from "../components/Toast";
import useArray from "./useArray";

const ToastContext = createContext<{ open: (content: ToastProps) => void }>({
  open: () => {},
});

// Create a random ID
function generateUEID() {
  let first = (Math.random() * 46656) | 0;
  let second = (Math.random() * 46656) | 0;
  const firstStr = ("000" + first.toString(36)).slice(-3);
  const secondStr = ("000" + second.toString(36)).slice(-3);

  return firstStr + secondStr;
}

type ToastProps = Omit<FullProps, "close">;

export interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const {
    array: toasts,
    push: addToast,
    remove: removeToast,
    find: findToast,
  } = useArray<ToastProps>();

  const open = useCallback(
    (content: ToastProps) => addToast({ id: generateUEID(), ...content }),
    [addToast]
  );
  const close = useCallback(
    (id: string) => {
      const toast = findToast((toast) => toast.id === id);
      console.log({ closing: id, toast, toasts });
      if (toast) removeToast(toast);
    },
    [findToast, removeToast, toasts]
  );
  const contextValue = useMemo(() => ({ open }), [open]);

  if (typeof window === "undefined") return null;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {createPortal(
        <div className="absolute top-4 right-4">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} close={() => close(toast.id!)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export default function useToast() {
  return useContext(ToastContext);
}
