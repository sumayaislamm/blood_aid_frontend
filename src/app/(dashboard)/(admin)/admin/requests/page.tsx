
"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Droplets,
  Loader2,
  RefreshCw,
  Search,
  MapPin,
  CalendarDays,
  Users,
  AlertTriangle,
} from "lucide-react";

import {
  getAdminBloodRequests,
  updateAdminBloodRequestStatus,
  type AdminBloodRequestItem,
} from "@/src/features/admin/admin.api";

import type {
  BloodRequestStatus,
  BloodGroup,
  BloodRequestUrgency,
} from "@/src/features/blood-requests/blood-requests.api";

const PAGE_SIZE = 10;

const STATUSES: BloodRequestStatus[] = [
  "PENDING",
  "MATCHED",
  "FULFILLED",
  "CANCELLED",
  "EXPIRED",
];

const BLOOD_GROUPS: BloodGroup[] = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

const URGENCIES: BloodRequestUrgency[] = [
  "NORMAL",
  "URGENT",
  "CRITICAL",
];

function label(value: string) {
  return value.replaceAll("_", " ");
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusClass(status: BloodRequestStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "MATCHED":
      return "bg-blue-100 text-blue-800";
    case "FULFILLED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "EXPIRED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-muted text-foreground";
  }
}

function urgencyClass(urgency: BloodRequestUrgency) {
  switch (urgency) {
    case "CRITICAL":
      return "bg-red-100 text-red-800";
    case "URGENT":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function AdminBloodRequestsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] =
    useState<BloodGroup | "ALL">("ALL");
  const [urgency, setUrgency] =
    useState<BloodRequestUrgency | "ALL">("ALL");
  const [status, setStatus] =
    useState<BloodRequestStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "admin-blood-requests",
      { page, search, city, bloodGroup, urgency, status },
    ],
    queryFn: () =>
      getAdminBloodRequests({
        page,
        limit: PAGE_SIZE,
        search,
        city,
        bloodGroup,
        urgency,
        status,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });

  const requests = data?.data?.bloodRequests ?? [];
  const pagination = data?.data?.pagination;
  const total = pagination?.total ?? requests.length;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  const statusMutation = useMutation({
    mutationFn: ({
      requestId,
      status: nextStatus,
    }: {
      requestId: string;
      status: BloodRequestStatus;
    }) => updateAdminBloodRequestStatus(requestId, nextStatus),

    onSuccess: async (result) => {
      setFeedback(
        result.message || "Blood request status updated successfully.",
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-blood-requests"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-stats"],
        }),
      ]);
    },

    onError: (error) => {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to update request status.",
      );
    },
  });

  function changeFilters() {
    setPage(1);
    setFeedback("");
  }

  function handleStatusUpdate(
    request: AdminBloodRequestItem,
    nextStatus: BloodRequestStatus,
  ) {
    if (request.status === nextStatus) return;

    const confirmed = window.confirm(
      `Change request ${request.id} from ${request.status} to ${nextStatus}?`,
    );

    if (!confirmed) return;

    setFeedback("");

    statusMutation.mutate({
      requestId: request.id,
      status: nextStatus,
    });
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Blood Requests
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Review emergency requests and manage their statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total matching requests
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums">
                {total.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Current page
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums">
                {page} / {totalPages}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="relative xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <label htmlFor="request-search" className="sr-only">
              Search blood requests
            </label>

            <input
              id="request-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                changeFilters();
              }}
              placeholder="Search hospital, address, city..."
              className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <label htmlFor="request-city" className="sr-only">
              Filter by city
            </label>

            <input
              id="request-city"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                changeFilters();
              }}
              placeholder="Filter by city"
              className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label htmlFor="request-blood-group" className="sr-only">
              Filter by blood group
            </label>

            <select
              id="request-blood-group"
              value={bloodGroup}
              onChange={(event) => {
                setBloodGroup(event.target.value as BloodGroup | "ALL");
                changeFilters();
              }}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            >
              <option value="ALL">All blood groups</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {label(group)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="request-urgency" className="sr-only">
              Filter by urgency
            </label>

            <select
              id="request-urgency"
              value={urgency}
              onChange={(event) => {
                setUrgency(
                  event.target.value as BloodRequestUrgency | "ALL",
                );
                changeFilters();
              }}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            >
              <option value="ALL">All urgency levels</option>
              {URGENCIES.map((item) => (
                <option key={item} value={item}>
                  {label(item)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="request-status" className="sr-only">
              Filter by status
            </label>

            <select
              id="request-status"
              value={status}
              onChange={(event) => {
                setStatus(
                  event.target.value as BloodRequestStatus | "ALL",
                );
                changeFilters();
              }}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            >
              <option value="ALL">All statuses</option>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {label(item)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border bg-background p-3 text-sm"
        >
          {feedback}
        </div>
      )}

      {/* Loading / Error / Empty / Table */}
      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center gap-2 rounded-xl border">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading blood requests...
          </span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load blood requests
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Check the admin API and your permissions, then try again.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <Droplets className="mx-auto h-9 w-9 text-muted-foreground" />

          <h2 className="mt-3 font-semibold">
            No blood requests found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing the search term or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="flex flex-col gap-1 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold">Request records</h2>

            <p className="text-sm text-muted-foreground">
              Showing {requests.length} of {total.toLocaleString()}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Request</th>
                  <th className="px-4 py-3 font-semibold">Requester</th>
                  <th className="px-4 py-3 font-semibold">Urgency</th>
                  <th className="px-4 py-3 font-semibold">Required date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Update status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {requests.map((request) => {
                  const isUpdating =
                    statusMutation.isPending &&
                    statusMutation.variables?.requestId === request.id;

                  return (
                    <tr
                      key={request.id}
                      className="align-top transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
                            <Droplets className="h-5 w-5" />
                          </div>

                          <div className="max-w-xs">
                            <p className="font-semibold">
                              {label(request.bloodGroup)}
                              {" · "}
                              {request.units} unit(s)
                            </p>

                            <p className="mt-1 font-medium">
                              {request.hospitalName}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {request.hospitalAddress}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {request.city}
                            </p>

                            {request.description && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs font-medium text-primary">
                                  View description
                                </summary>
                                <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                                  {request.description}
                                </p>
                              </details>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium">
                          {request.requester?.name || "Unknown"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {request.requester?.email || "—"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {request.requester?.phone || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${urgencyClass(request.urgency)}`}
                        >
                          {request.urgency !== "NORMAL" && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                          {label(request.urgency)}
                        </span>

                        {request.isPriority && (
                          <p className="mt-2 text-xs font-medium text-red-700">
                            Priority request
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(request.requiredDate)}</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Created {formatDate(request.createdAt)}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(request.status)}`}
                        >
                          {label(request.status)}
                        </span>

                        <p className="mt-2 text-xs text-muted-foreground">
                          {request._count?.responses ?? 0} response(s)
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {request._count?.donations ?? 0} donation(s)
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <label
                          htmlFor={`status-${request.id}`}
                          className="mb-2 block text-xs text-muted-foreground"
                        >
                          Choose new status
                        </label>

                        <select
                          id={`status-${request.id}`}
                          value={request.status}
                          disabled={statusMutation.isPending}
                          onChange={(event) =>
                            handleStatusUpdate(
                              request,
                              event.target.value as BloodRequestStatus,
                            )
                          }
                          className="w-40 rounded-lg border bg-background px-3 py-2 text-xs disabled:opacity-50"
                        >
                          {STATUSES.map((item) => (
                            <option key={item} value={item}>
                              {label(item)}
                            </option>
                          ))}
                        </select>

                        {isUpdating && (
                          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Updating...
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                disabled={page <= 1 || isFetching}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1),
                  )
                }
                disabled={page >= totalPages || isFetching}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs leading-5 text-muted-foreground">
        Status changes are saved through the backend. Each successful
        change should also create an audit log entry.
      </p>
    </section>
  );
}
