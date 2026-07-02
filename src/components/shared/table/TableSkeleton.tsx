import { TableCell, TableRow } from "./Table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((__, colIndex) => (
            <TableCell key={colIndex}>
              <div className="h-4 w-full max-w-35 animate-pulse rounded bg-w-black/10" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
