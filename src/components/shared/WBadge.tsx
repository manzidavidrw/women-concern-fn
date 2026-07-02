import { ReactNode } from "react";

type BadgeVariant =
  | "primary"
  | "danger"
  | "warning"
  | "info"
  | "success"
  | "destructive"
  | "outline"
  | "outlineDanger"
  | "outlineSolid"
  | "pending";

type BadgeSize = "sm" | "md" | "lg";

interface WBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children: ReactNode;
}

const baseStyles = "inline-flex items-center justify-center rounded-md font-medium";

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-w-green text-w-white",
  danger: "bg-w-red text-w-white",
  warning: "bg-w-gold/10 text-w-gold border border-w-gold/30",
  info: "bg-blue-500 text-white",
  success: "bg-w-green/10 text-w-green border border-w-green/30",
  destructive: "bg-w-red/10 text-w-red border border-w-red/30",
  outline: "bg-transparent border border-gray-300 text-gray-700",
  outlineDanger: "bg-transparent border border-w-red text-w-red",
  outlineSolid: "bg-transparent border border-w-green text-w-green",
  pending: "bg-w-gold/10 text-w-gold",
};

export default function WBadge({
  variant = "primary",
  size = "md",
  className = "",
  children,
}: WBadgeProps) {
  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
