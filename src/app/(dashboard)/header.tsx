"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/src/stores/auth.store";

const pageTitles: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/donor": "Donor Dashboard",
  "/requester": "Requester Dashboard",
};

export default function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const basePath = pathname.split("/").slice(0, 2).join("/");
  const title = pageTitles[basePath] ?? "Blood Aid";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      {" "}
      <div className="flex items-center gap-3">
        {" "}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-muted md:hidden"
          aria-label="Open navigation menu"
        >
          {" "}
          <Menu className="h-5 w-5" />{" "}
        </button>
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Welcome back, {user?.name ?? "User"}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="relative rounded-full p-2 hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />

        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
      </button>
    </header>
  );
}
