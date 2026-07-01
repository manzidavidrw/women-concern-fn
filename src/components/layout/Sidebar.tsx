"use client";

import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/src/hooks/useAuth";
import { UserRole } from "@/src/services/authService";
import { sidebarItems } from "./sidebarItems";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  roles?: UserRole[];
}

export default function Sidebar({ isOpen, onClose, roles }: SidebarProps) {
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const items = roles
    ? sidebarItems.filter((item) =>
        item.roles.some((role) => roles.includes(role)),
      )
    : sidebarItems;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-w-black/40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col bg-w-green transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center px-6 text-lg font-semibold text-w-gold">
          Women Concern
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {items.map((item) => {
            const isActive = pathname === item.link;
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.link}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-w-gold text-w-black"
                    : "text-w-white/90 hover:bg-w-white/10"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-w-white/10 px-3 pt-3 pb-4">
          <button
            type="button"
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-w-white/90 transition-colors hover:bg-w-red/15 hover:text-w-red disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-w-white/90"
          >
            {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
