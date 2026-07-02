import {
  FileText,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Users,
} from "lucide-react";
import { UserRole } from "@/src/services/authService";

export interface SidebarItem {
  key: string;
  label: string;
  link: string;
  roles: UserRole[];
  icon: LucideIcon;
}

export const sidebarItems: SidebarItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    link: "/dashboard",
    roles: [
      "ADMIN",
      "EXECUTIVE_DIRECTOR",
      "PROJECT_MANAGER",
      "FINANCE",
      "FIELD_OFFICER",
    ],
    icon: LayoutDashboard,
  },
  {
    key: "users",
    label: "Users",
    link: "/dashboard/users",
    roles: ["ADMIN", "EXECUTIVE_DIRECTOR"],
    icon: Users,
  },
  {
    key: "reports",
    label: "Reports",
    link: "/dashboard/reports",
    roles: ["ADMIN", "EXECUTIVE_DIRECTOR", "PROJECT_MANAGER", "FINANCE"],
    icon: FileText,
  },
  {
    key: "settings",
    label: "Settings",
    link: "/dashboard/settings",
    roles: ["ADMIN", "EXECUTIVE_DIRECTOR", "FIELD_OFFICER"],
    icon: Settings,
  },
];
