
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth.store";
import { clearAuthCookie } from "@/src/lib/auth-cookie";
import { ArrowLeft, LogOut, ShieldX } from "lucide-react";

const dashboardPaths = {
  ADMIN: "/admin",
  DONOR: "/donor",
  REQUESTER: "/requester",
} as const;

export default function UnauthorizedPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const dashboardPath = user ? dashboardPaths[user.role] : "/login";

  function handleLogout() {
    clearAuthCookie();
    clearAuth();
    router.replace("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-7 w-7 text-destructive" />
        </div>

        <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You do not have permission to access this page. Please return to your
          dashboard or sign in with an authorized account.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={dashboardPath}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            My Dashboard
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
