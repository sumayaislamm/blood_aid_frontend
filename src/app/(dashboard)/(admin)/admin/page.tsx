"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, HeartPulse, Loader2, Users, Droplets } from "lucide-react";

import { getAdminStats } from "@/src/features/admin/admin.api";

export default function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  const stats = data?.data;

const cards = [
  {
    label: "Total Users",
    value: stats?.users.total ?? 0,
    icon: Users,
  },
  {
    label: "Blood Requests",
    value: stats?.bloodRequests.total ?? 0,
    icon: Droplets,
  },
  {
    label: "Donations",
    value: stats?.donations.total ?? 0,
    icon: HeartPulse,
  },
  {
    label: "Payments",
    value: stats?.payments.total ?? 0,
    icon: CreditCard,
  },
];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Administration</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor users, blood requests, donations, and payments.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border bg-background">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading dashboard statistics...
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h3 className="font-semibold text-destructive">
            Unable to load dashboard statistics
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-xl border bg-background p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold">{card.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
