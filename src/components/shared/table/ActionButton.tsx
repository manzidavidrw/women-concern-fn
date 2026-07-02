"use client";

import { ReactNode } from "react";

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  className = "",
}: ActionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full p-2 text-w-green transition-colors hover:bg-w-green/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {icon}
    </button>
  );
}
