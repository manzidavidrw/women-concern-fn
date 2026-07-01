"use client";

import { ReactNode, useState } from "react";
import { UserRole } from "@/src/services/authService";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  roles?: UserRole[];
}

export default function DashboardLayout({ children, roles }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-w-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} roles={roles} />
      <div className="flex flex-1 flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
