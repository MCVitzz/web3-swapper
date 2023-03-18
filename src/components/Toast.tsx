import React from "react";
import { useTimeout } from "../hooks/useTimeout";

export interface ToastProps {
  id?: string;
  close: () => void;
  children: React.ReactNode;
  timeout?: number;
  type: "success" | "error";
}

export const Toast: React.FC<ToastProps> = ({
  children,
  close,
  timeout = 5000,
  type = "error",
}) => {
  useTimeout(close, timeout);

  return (
    <div
      onClick={close}
      className={`flex relative cursor-pointer mt-4 p-4 shadow-sm rounded-sm max-w-md text-white overflow-hidden text-ellipsis whitespace-nowrap ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {children}
    </div>
  );
};
