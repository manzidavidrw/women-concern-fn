"use client";

import { ReactNode } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination, { PaginationProps } from "./Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./Table";
import { TableSkeleton } from "./TableSkeleton";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  renderActions?: (row: TData) => ReactNode;
  emptyMessage?: string;
  pagination?: PaginationProps;
  isLoading?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  renderActions,
  emptyMessage = "No data found.",
  pagination,
  isLoading = false,
}: DataTableProps<TData>) {
  const allColumns: ColumnDef<TData, unknown>[] = renderActions
    ? [
        ...columns,
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => renderActions(row.original),
        },
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} isHeader>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id} isHeader>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={allColumns.length} />
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && data.length === 0 && (
        <p className="px-4 py-6 text-center text-w-black/60">{emptyMessage}</p>
      )}
      {!isLoading && pagination && data.length > 0 && <Pagination {...pagination} />}
    </div>
  );
}
