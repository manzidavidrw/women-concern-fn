"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
  onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis";

function getPageRange(current: number, total: number): PageItem[] {
  const delta = 1;
  const start = Math.max(0, current - delta);
  const end = Math.min(total - 1, current + delta);
  const range: PageItem[] = [0];

  // Only collapse into an ellipsis when it actually hides 2+ pages —
  // hiding a single page behind "…" just adds noise instead of saving space.
  if (start > 2) {
    range.push("ellipsis");
  } else if (start === 2) {
    range.push(1);
  }

  for (let i = start; i <= end; i++) {
    if (i !== 0 && i !== total - 1) range.push(i);
  }

  if (end < total - 3) {
    range.push("ellipsis");
  } else if (end === total - 3) {
    range.push(total - 2);
  }

  if (total > 1) range.push(total - 1);

  return range;
}

export default function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  first,
  last,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const rangeStart = page * pageSize + 1;
  const rangeEnd = Math.min(totalElements, (page + 1) * pageSize);
  const pages = getPageRange(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-w-black/10 px-4 py-3 sm:flex-row">
      <p className="text-sm text-w-black/60">
        Showing <span className="font-medium text-w-black">{rangeStart}</span>-
        <span className="font-medium text-w-black">{rangeEnd}</span> of{" "}
        <span className="font-medium text-w-black">{totalElements}</span>{" "}
        results
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={first}
          aria-label="Previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-w-black/15 text-w-black/60 transition-colors hover:border-w-green/30 hover:bg-w-green/10 hover:text-w-green disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-w-black/15 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-w-black/40"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors ${
                item === page
                  ? "border-w-green bg-w-green text-w-white"
                  : "border-w-black/15 text-w-black/70 hover:border-w-green/30 hover:bg-w-green/10 hover:text-w-green"
              }`}
            >
              {item + 1}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={last}
          aria-label="Next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-w-black/15 text-w-black/60 transition-colors hover:border-w-green/30 hover:bg-w-green/10 hover:text-w-green disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-w-black/15 disabled:hover:bg-transparent"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
