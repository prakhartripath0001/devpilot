import { Home, MessageSquare, Settings, type LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const dashboardNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        exact: true,
      },
      {
        title: "Chat",
        href: "/chat",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Preferences",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export function isDashboardNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname.startsWith(href);
}
