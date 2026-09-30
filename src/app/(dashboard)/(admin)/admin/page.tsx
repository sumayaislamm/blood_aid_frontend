"use client";

import { useAuthStore } from "@/src/stores/auth.store";



export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Welcome, {user?.name ?? "Admin"}!
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage users, blood requests, donations, payments, and platform
            activity.
          </p>
        </div>
      </div>
    </main>
  );
}