import { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-w-black/10 pt-4 first:border-t-0 first:pt-0">
      <h4 className="mb-3 text-xs font-semibold tracking-wider text-w-green uppercase">{title}</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-w-green/10 text-w-green">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-w-black/50">{label}</p>
        <p className="truncate text-sm text-w-black">{value || "—"}</p>
      </div>
    </div>
  );
}
