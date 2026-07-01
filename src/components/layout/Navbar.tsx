"use client";

import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
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
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-w-gold" />
      </div>
    </header>
  );
}
