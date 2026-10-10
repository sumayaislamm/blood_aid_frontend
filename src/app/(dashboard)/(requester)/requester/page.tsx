// "use client";

// import { useQuery } from "@tanstack/react-query";

// import { getMyBloodRequests } from "@/src/features/blood-requests/blood-requests.api";

// export default function RequesterDashboard() {
//   const requestsQuery = useQuery({
//     queryKey: ["my-blood-requests"],
//     queryFn: getMyBloodRequests,
//   });

//   console.log("MY BLOOD REQUESTS:", requestsQuery.data);

//   return (
//     <main className="space-y-6">
//       <div>
//         <p className="text-sm text-muted-foreground">
//           Requester Dashboard
//         </p>

//         <h1 className="mt-2 text-3xl font-bold">
//           Welcome, Requester!
//         </h1>
//       </div>

//       <div className="rounded-xl border bg-background p-6">
//         <p className="text-sm text-muted-foreground">
//           Check the browser console for the blood request API response.
//         </p>
//       </div>
//     </main>
//   );
// }


"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  HeartPulse,
  Hospital,
  MapPin,
  Plus,
  RefreshCw,
  Syringe,
} from "lucide-react";

import { getMyBloodRequests } from "@/src/features/blood-requests/blood-requests.api";

function formatBloodGroup(value: string) {
  return value.replace("_", " ");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusStyle(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "MATCHED":
      return "bg-blue-100 text-blue-800";
    case "FULFILLED":
      return "bg-emerald-100 text-emerald-800";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700";
    case "EXPIRED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getUrgencyStyle(urgency: string) {
  switch (urgency) {
    case "CRITICAL":
      return "bg-red-100 text-red-800";
    case "URGENT":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
}

export default function RequesterDashboard() {
  const requestsQuery = useQuery({
    queryKey: ["my-blood-requests"],
    queryFn: () => getMyBloodRequests(),
  });

  const requests = requestsQuery.data?.data ?? [];

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length;

  const matchedCount = requests.filter(
    (request) => request.status === "MATCHED",
  ).length;

  const fulfilledCount = requests.filter(
    (request) => request.status === "FULFILLED",
  ).length;

  const recentRequests = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      description: "All your blood requests",
      icon: Droplets,
      iconStyle: "bg-rose-100 text-rose-600",
    },
    {
      label: "Pending",
      value: pendingCount,
      description: "Waiting for a response",
      icon: Clock3,
      iconStyle: "bg-amber-100 text-amber-700",
    },
    {
      label: "Matched",
      value: matchedCount,
      description: "Donor responses matched",
      icon: Activity,
      iconStyle: "bg-blue-100 text-blue-700",
    },
    {
      label: "Fulfilled",
      value: fulfilledCount,
      description: "Requests fulfilled",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <main className="space-y-8 pb-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-700 via-rose-600 to-red-500 p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
              <HeartPulse className="h-4 w-4" />
              Every drop makes a difference
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome to your dashboard
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-rose-50 sm:text-base">
              Manage your blood requests, track their progress, and connect
              with people who can help save a life.
            </p>

            <Link
              href="/requester/new"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Plus className="h-4 w-4" />
              Create Blood Request
            </Link>
          </div>

          <div className="hidden shrink-0 items-center justify-center sm:flex">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/25 bg-white/10">
              <Droplets className="h-16 w-16" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 -top-20 h-48 w-48 rounded-full border border-white/10" />
      </section>

      {/* Summary cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Request Overview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick summary of your blood requests.
          </p>
        </div>

        {requestsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl border bg-background"
              />
            ))}
          </div>
        ) : requestsQuery.isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <p className="font-medium text-destructive">
              Unable to load your request overview.
            </p>
            <button
              type="button"
              onClick={() => requestsQuery.refetch()}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-3xl font-bold tracking-tight">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent requests */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Recent Blood Requests
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your three most recently created requests.
            </p>
          </div>

          <Link
            href="/requester/requests"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all requests
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {requestsQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-xl border bg-background"
              />
            ))}
          </div>
        ) : requestsQuery.isError ? (
          <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
            Your requests could not be displayed. Please retry loading the
            dashboard.
          </div>
        ) : recentRequests.length === 0 ? (
          <div className="rounded-xl border bg-background px-5 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <Droplets className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No blood requests yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              When you need blood donation support, create a request to share
              the details with potential donors.
            </p>

            <Link
              href="/requester/new"
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create your first request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                        <Droplets className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {formatBloodGroup(request.bloodGroup)}
                          </h3>

                          {request.isPriority && (
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                              Priority
                            </span>
                          )}
                        </div>

                        <p className="mt-1 break-all text-xs text-muted-foreground">
                          Request ID: {request.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getUrgencyStyle(request.urgency)}`}
                      >
                        {request.urgency}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-start gap-2.5">
                      <Syringe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Blood Needed
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {request.units}{" "}
                          {request.units === 1 ? "unit" : "units"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Hospital className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Hospital
                        </p>
                        <p className="mt-1 break-words text-sm font-medium">
                          {request.hospitalName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {request.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Required Date
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {formatDate(request.requiredDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {request.description && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Additional Details
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
                        {request.description}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(request.createdAt)}
                    </p>

                    <Link
                      href={`/requester/requests/${request.id}`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="rounded-xl border bg-background p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your requests without navigating through multiple pages.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/requester/new"
            className="flex items-center gap-4 rounded-xl border p-4 transition hover:border-primary/50 hover:bg-muted/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <Plus className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Create a Request</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Submit a new blood donation request.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>

          <Link
            href="/requester/requests"
            className="flex items-center gap-4 rounded-xl border p-4 transition hover:border-primary/50 hover:bg-muted/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Manage Requests</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Review your requests and check their progress.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        </div>
      </section>
    </main>
  );
}
