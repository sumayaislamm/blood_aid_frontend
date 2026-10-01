"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Droplets,
  Hospital,
  Loader2,
  MapPin,
  Plus,
  Syringe,
} from "lucide-react";
import Link from "next/link";

import { getMyBloodRequests } from "@/src/features/blood-requests/blood-requests.api";

function formatBloodGroup(bloodGroup: string) {
  return bloodGroup.replace("_", " ");
}

function formatStatus(status: string) {
  return status.replace("_", " ");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function getStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "MATCHED":
      return "bg-blue-100 text-blue-800";
    case "FULFILLED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700";
    case "EXPIRED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getUrgencyClass(urgency: string) {
  switch (urgency) {
    case "CRITICAL":
      return "bg-red-100 text-red-800";
    case "URGENT":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-green-100 text-green-800";
  }
}

export default function MyBloodRequestsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-blood-requests"],
    queryFn: getMyBloodRequests,
  });

  const requests = data?.data ?? [];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Requester Dashboard</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            My Blood Requests
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View and manage the blood requests you have created.
          </p>
        </div>

        <Link
          href="/requester/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Request
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-xl border bg-background"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load your blood requests
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Droplets className="h-6 w-6 text-primary" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">No blood requests yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            You haven&apos;t created any blood requests yet. Create a request
            when you need blood donation support.
          </p>

          <Link
            href="/requester/new"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Your First Request
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Droplets className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">
                          {formatBloodGroup(request.bloodGroup)}
                        </h2>

                        {request.isPriority && (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                            Priority
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Request ID: {request.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getUrgencyClass(
                        request.urgency,
                      )}`}
                    >
                      {formatStatus(request.urgency)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        request.status,
                      )}`}
                    >
                      {formatStatus(request.status)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-start gap-2">
                    <Syringe className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Blood Needed
                      </p>
                      <p className="mt-0.5 text-sm font-medium">
                        {request.units} {request.units === 1 ? "unit" : "units"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Hospital className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-xs text-muted-foreground">Hospital</p>
                      <p className="mt-0.5 text-sm font-medium">
                        {request.hospitalName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="mt-0.5 text-sm font-medium">
                        {request.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Required Date
                      </p>
                      <p className="mt-0.5 text-sm font-medium">
                        {formatDate(request.requiredDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {request.description && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="mt-1 text-sm">{request.description}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {request.status}
                  </span>

                  <Link
                    href={`/requester/requests/${request.id}`}
                    className="
                        inline-flex items-center rounded-md border px-3 py-1.5 text-xs justify-center gap-2 bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90
                        "
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
