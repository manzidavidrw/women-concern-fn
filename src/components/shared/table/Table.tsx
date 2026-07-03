import { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import WBadge from "@/src/components/shared/WBadge";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

interface TableCellProps
  extends
    TdHTMLAttributes<HTMLTableCellElement>,
    ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

interface RoleBadgeProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <table
      className={`w-full table-auto border-separate border-spacing-0  overflow-hidden rounded-lg border border-w-black/10 ${className}`}
    >
      {children}
    </table>
  );
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead className={` bg-w-green text-w-white ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({
  children,
  isHeader = false,
  className = "",
}: TableRowProps) {
  return (
    <tr
      className={`${isHeader ? "hover:bg-none" : " hover:bg-w-green/5"} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  isHeader = false,
  className = "",
  ...props
}: TableCellProps) {
  const CellTag = isHeader ? "th" : "td";
  const baseClasses =
    "border-b border-w-black/10 px-4 py-3 text-left align-middle text-sm text-w-black";
  const headerClasses =
    "text-sm font-medium uppercase tracking-wider text-w-white";
  const cellClasses = [
    baseClasses,
    isHeader ? headerClasses : "whitespace-nowrap",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <CellTag className={cellClasses} {...props}>
      {children}
    </CellTag>
  );
}

export function RoleBadge({ children, className = "" }: RoleBadgeProps) {
  return (
    <WBadge variant="outline" className={className}>
      {children}
    </WBadge>
  );
}
