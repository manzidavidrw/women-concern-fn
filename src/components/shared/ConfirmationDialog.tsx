"use client";

import { ReactNode } from "react";
import Button from "@/src/components/shared/Button";
import Modal from "@/src/components/shared/Modal";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonVariant = "primary",
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      hideCloseButton
      closeOnBackdropClick={!isLoading}
    >
      <div className="py-2">
        <p className="text-sm text-w-black md:text-base">{message}</p>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelButtonText}
        </Button>
        <Button
          type="button"
          variant={confirmButtonVariant}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : confirmButtonText}
        </Button>
      </div>
    </Modal>
  );
}
