
"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldBan,
  Users,
} from "lucide-react";

import {
  getAdminUsers,
  updateAdminUserStatus,
  type AdminUserItem,
} from "@/src/features/admin/admin.api";

import type {
  UserRole,
  UserStatus,
} from "@/src/types/auth";

const PAGE_SIZE = 10;

const statusStyles: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  BLOCKED: "bg-red-100 text-red-800",
  DELETED: "bg-gray-100 text-gray-700",
};

const roleStyles: Record<UserRole, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  DONOR: "bg-blue-100 text-blue-800",
  REQUESTER: "bg-orange-100 text-orange-800",
};

function formatDateLabel(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
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
      "admin-users",
      { page, limit: PAGE_SIZE, search, role, status },
    ],
    queryFn: () =>
      getAdminUsers({
        page,
        limit: PAGE_SIZE,
        search,
        role,
        status,
      }),
  });

  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination;

  const totalUsers = pagination?.total ?? users.length;
  const totalPages = Math.max(
    1,
    pagination?.totalPages ?? 1,
  );

  const statusMutation = useMutation({
    mutationFn: ({
      userId,
      nextStatus,
    }: {
      userId: string;
      nextStatus: UserStatus;
    }) => updateAdminUserStatus(userId, nextStatus),

    onSuccess: async (_result, variables) => {
      setFeedback(
        variables.nextStatus === "BLOCKED"
          ? "User blocked successfully."
          : variables.nextStatus === "ACTIVE"
            ? "User unblocked successfully."
            : "User status updated successfully.",
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-users"],
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
          : "Unable to update user status. Please try again.",
      );
    },
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
    setFeedback("");
  }

  function handleRoleChange(value: string) {
    setRole(value as UserRole | "ALL");
    setPage(1);
    setFeedback("");
  }

  function handleStatusChange(value: string) {
    setStatus(value as UserStatus | "ALL");
    setPage(1);
    setFeedback("");
  }

  function handleToggleStatus(user: AdminUserItem) {
    if (user.status === "DELETED") return;

    const nextStatus: UserStatus =
      user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

    const action =
      nextStatus === "BLOCKED" ? "block" : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`,
    );

    if (!confirmed) return;

    setFeedback("");
    statusMutation.mutate({
      userId: user.id,
      nextStatus,
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
            User Management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Search users, review account roles, and manage account status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* Total users */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total users
              </p>
              <p className="mt-2 text-3xl font-bold">
                {totalUsers.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Current page
              </p>
              <p className="mt-2 text-3xl font-bold">
                {page} / {totalPages}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <label htmlFor="user-search" className="sr-only">
              Search users
            </label>

            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label
              htmlFor="user-role"
              className="sr-only"
            >
              Filter by role
            </label>

            <select
              id="user-role"
              value={role}
              onChange={(event) =>
                handleRoleChange(event.target.value)
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            >
              <option value="ALL">All roles</option>
              <option value="ADMIN">Admin</option>
              <option value="DONOR">Donor</option>
              <option value="REQUESTER">Requester</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="user-status"
              className="sr-only"
            >
              Filter by status
            </label>

            <select
              id="user-status"
              value={status}
              onChange={(event) =>
                handleStatusChange(event.target.value)
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DELETED">Deleted</option>
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

      {/* Loading */}
      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center gap-2 rounded-xl border">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading users...
          </span>
        </div>
      ) : isError ? (
        /* Error */
        <div className="rounded-xl border border-destructive/30 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load users
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Check the admin API, your connection, and your permissions.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      ) : users.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border p-10 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />

          <h2 className="mt-3 font-semibold">
            No users found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filter criteria.
          </p>
        </div>
      ) : (
        /* Users table */
        <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="flex flex-col gap-1 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold">Users</h2>

            <p className="text-sm text-muted-foreground">
              Showing {users.length} of {totalUsers.toLocaleString()} users
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    User
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Phone
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Role
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => {
                  const isUpdating =
                    statusMutation.isPending &&
                    statusMutation.variables?.userId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-4">
                        <p className="font-medium">
                          {user.name || "Unnamed user"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {user.phone || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${roleStyles[user.role]}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {user.status === "DELETED" ? (
                          <span className="text-xs text-muted-foreground">
                            No actions available
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(user)
                            }
                            disabled={
                              statusMutation.isPending ||
                              user.role === "ADMIN"
                            }
                            title={
                              user.role === "ADMIN"
                                ? "Admin accounts cannot be blocked here"
                                : user.status === "BLOCKED"
                                  ? "Unblock this user"
                                  : "Block this user"
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : user.status === "BLOCKED" ? (
                              <ShieldCheck className="h-4 w-4" />
                            ) : (
                              <ShieldBan className="h-4 w-4" />
                            )}

                            {isUpdating
                              ? "Updating..."
                              : user.status === "BLOCKED"
                                ? "Unblock"
                                : "Block"}
                          </button>
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

      {isFetching && !isLoading && (
        <p className="text-xs text-muted-foreground">
          Updating user list...
        </p>
      )}

      <p className="text-xs leading-5 text-muted-foreground">
        Account status changes must be authorized and validated by the
        backend. This page does not allow blocking admin accounts.
      </p>
    </section>
  );
}
