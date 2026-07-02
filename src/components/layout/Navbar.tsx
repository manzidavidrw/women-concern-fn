"use client";

import { Menu } from "lucide-react";
import { useAuthContext } from "@/src/contexts/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuthContext();

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : "";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-w-black/10 bg-w-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-w-green hover:bg-w-green/10 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <span className="text-lg font-semibold text-w-green">Dashboard</span>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-w-gold text-sm font-semibold text-w-black">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm  text-w-black font-bold">{displayName}</p>
            <p className="text-xs capitalize text-w-black/60">
              {user.role.replace(/_/g, " ").toLowerCase()}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
