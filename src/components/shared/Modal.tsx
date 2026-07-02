"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  hideCloseButton = false,
  closeOnBackdropClick = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-w-black/30 backdrop-blur-sm"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-w-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-w-black/10 px-6 py-4">
          {title && <h2 className="text-lg font-semibold text-w-green">{title}</h2>}
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded-full p-1 text-w-black/50 transition-colors hover:bg-w-black/5 hover:text-w-black"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
