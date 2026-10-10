// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { CreditCard, HeartPulse, Loader2, Users, Droplets, ShieldCheck } from "lucide-react";

// import { getAdminStats } from "@/src/features/admin/admin.api";

// export default function AdminDashboard() {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["admin-stats"],
//     queryFn: getAdminStats,
//   });

//   const stats = data?.data;

//   const cards = [
//     {
//       label: "Total Users",
//       value: stats?.users.total ?? 0,
//       icon: Users,
//     },
//     {
//       label: "Blood Requests",
//       value: stats?.bloodRequests.total ?? 0,
//       icon: Droplets,
//     },
//     {
//       label: "Donations",
//       value: stats?.donations.total ?? 0,
//       icon: HeartPulse,
//     },
//     {
//       label: "Payments",
//       value: stats?.payments.total ?? 0,
//       icon: CreditCard,
//     },
//     {
//       label: "Verified Donations",
//       value: stats?.donations.verified ?? 0,
//       description: `${stats?.donations.total ?? 0} total`,
//       icon: ShieldCheck,
//     },
//   ];

//   return (
//     <section className="space-y-6">
//       <div>
//         <p className="text-sm text-muted-foreground">Administration</p>
//         <h2 className="mt-1 text-2xl font-bold tracking-tight">Overview</h2>
//         <p className="mt-1 text-sm text-muted-foreground">
//           Monitor users, blood requests, donations, and payments.
//         </p>
//       </div>

//       {isLoading ? (
//         <div className="flex min-h-48 items-center justify-center rounded-xl border bg-background">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Loader2 className="h-4 w-4 animate-spin" />
//             Loading dashboard statistics...
//           </div>
//         </div>
//       ) : isError ? (
//         <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
//           <h3 className="font-semibold text-destructive">
//             Unable to load dashboard statistics
//           </h3>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Please try again in a moment.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
//           {cards.map((card) => {
//             const Icon = card.icon;

//             return (
//               <div
//                 key={card.label}
//                 className="rounded-xl border bg-background p-5 shadow-sm"
//               >
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-muted-foreground">
//                     {card.label}
//                   </p>

//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//                     <Icon className="h-5 w-5 text-primary" />
//                   </div>
//                 </div>

//                 <p className="mt-4 text-3xl font-bold">{card.value}</p>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }




"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  HeartPulse,
  Loader2,
  Users,
  Droplets,
  ShieldCheck,
  RefreshCw,
  Activity,
  TrendingUp,
} from "lucide-react";

import { getAdminStats } from "@/src/features/admin/admin.api";

export default function AdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  const stats = data?.data;

  const totalUsers = stats?.users?.total ?? 0;
  const totalRequests = stats?.bloodRequests?.total ?? 0;
  const totalDonations = stats?.donations?.total ?? 0;
  const verifiedDonations = stats?.donations?.verified ?? 0;
  const totalPayments = stats?.payments?.total ?? 0;

  const verificationRate =
    totalDonations > 0
      ? Math.min(
          100,
          Math.round((verifiedDonations / totalDonations) * 100)
        )
      : 0;

  const cards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Registered users",
    },
    {
      label: "Blood Requests",
      value: totalRequests,
      icon: Droplets,
      description: "Total requests",
    },
    {
      label: "Donations",
      value: totalDonations,
      icon: HeartPulse,
      description: "Total donations",
    },
    {
      label: "Payments",
      value: totalPayments,
      icon: CreditCard,
      description: "Recorded payments",
    },
    {
      label: "Verified Donations",
      value: verifiedDonations,
      icon: ShieldCheck,
      description: `${verificationRate}% verification rate`,
    },
  ];

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Administration
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Overview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading your dashboard statistics...
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="animate-pulse rounded-xl border bg-background p-5"
            >
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="mt-6 h-9 w-20 rounded bg-muted" />
              <div className="mt-4 h-3 w-32 rounded bg-muted" />
            </div>
          ))}
        </div>

        <div className="flex min-h-40 items-center justify-center rounded-xl border bg-background">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Fetching analytics...
          </span>
        </div>
      </section>
    );
  }

  if (isError || !stats) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Administration
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Overview
          </h2>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h3 className="font-semibold text-destructive">
            Unable to load dashboard statistics
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and admin API permissions, then try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Administration
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Overview
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor users, blood requests, donations, and payments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh data
        </button>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold tracking-tight">
                {card.value.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overview chart */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">
                Platform Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                Current totals across the platform
              </p>
            </div>
          </div>

          {(() => {
            const metrics = [
              {
                label: "Users",
                value: totalUsers,
              },
              {
                label: "Blood Requests",
                value: totalRequests,
              },
              {
                label: "Donations",
                value: totalDonations,
              },
              {
                label: "Payments",
                value: totalPayments,
              },
            ];

            const maxValue = Math.max(
              ...metrics.map((item) => item.value),
              1
            );

            return (
              <div className="mt-6 space-y-5">
                {metrics.map((item) => {
                  const percentage = Math.round(
                    (item.value / maxValue) * 100
                  );

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>

                        <span className="text-sm tabular-nums text-muted-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      </div>

                      <div
                        className="h-2.5 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-label={`${item.label} relative total`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentage}
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <p className="mt-5 text-xs text-muted-foreground">
            Bars compare current totals; they do not represent changes over time.
          </p>
        </div>

        {/* Donation verification */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">
                Donation Verification
              </h3>
              <p className="text-sm text-muted-foreground">
                Verification status overview
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(var(--primary) ${verificationRate}%, hsl(var(--muted)) ${verificationRate}% 100%)`,
              }}
              role="img"
              aria-label={`${verificationRate}% of donations verified`}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-background">
                <span className="text-3xl font-bold">
                  {verificationRate}%
                </span>
                <span className="text-xs text-muted-foreground">
                  Verified
                </span>
              </div>
            </div>

            <div className="mt-6 grid w-full grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Verified
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {verifiedDonations.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Not verified
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {Math.max(
                    0,
                    totalDonations - verifiedDonations
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border bg-background p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">
            Administration Summary
          </h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The dashboard displays the latest statistics returned by the
          admin API. Use the Users, Blood Requests, Donations, and
          Payments management pages to review individual records and
          perform administrative actions.
        </p>
      </div>
    </section>
  );
}
