
"use client";

import { Suspense, useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { getAdminAuditLogs } from "@/src/features/admin/admin.api";

const PAGE_SIZE = 10;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function AdminAuditLogsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageValue = Number(searchParams.get("page") ?? "1");
  const page =
    Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;

  const search = searchParams.get("search") ?? "";
  const action = searchParams.get("action") ?? "";
  const entity = searchParams.get("entity") ?? "";

  const [searchInput, setSearchInput] = useState(search);

  const updateUrl = useCallback(
    (
      updates: Record<string, string | null>,
      resetPage = false,
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      if (resetPage) {
        params.delete("page");
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [
      "admin-audit-logs",
      { page, limit: PAGE_SIZE, search, action, entity },
    ],
    queryFn: () =>
      getAdminAuditLogs({
        page,
        limit: PAGE_SIZE,
        search,
        action: action || undefined,
        entity: entity || undefined,
        sortOrder: "desc",
      }),
  });

  const logs = data?.data?.auditLogs ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl({ search: searchInput.trim() || null }, true);
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Administration</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Audit Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review administrative actions and donation verification history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </header>

      <div className="rounded-xl border p-4">
        <p className="text-sm text-muted-foreground">
          Total matching audit logs
        </p>
        <p className="mt-1 text-2xl font-bold">
          {pagination?.total ?? 0}
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search audit logs"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search action, entity, admin..."
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>

        <select
          aria-label="Filter by action"
          value={action}
          onChange={(event) =>
            updateUrl({ action: event.target.value || null }, true)
          }
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="">All actions</option>
          <option value="VERIFY">Verify</option>
          <option value="UPDATE">Update</option>
          <option value="CREATE">Create</option>
          <option value="DELETE">Delete</option>
        </select>

        <select
          aria-label="Filter by entity"
          value={entity}
          onChange={(event) =>
            updateUrl({ entity: event.target.value || null }, true)
          }
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="">All entities</option>
          <option value="Donation">Donation</option>
          <option value="User">User</option>
          <option value="BloodRequest">Blood Request</option>
          <option value="Payment">Payment</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Search
        </button>
      </form>

      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center gap-2 rounded-xl border">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading audit logs...
          </span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 p-6">
          <p className="font-semibold text-destructive">
            Unable to load audit logs.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Try again
          </button>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-semibold">No audit logs found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Date &amp; Time</th>
                <th className="px-4 py-3 font-semibold">Admin</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Entity</th>
                <th className="px-4 py-3 font-semibold">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-4">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">
                      {log.user?.name ?? "Unknown"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {log.user?.email ?? "No email"}
                    </p>
                    {log.user?.role && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {log.user.role}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{log.entity}</p>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {log.entityId}
                    </p>
                  </td>
                  <td className="max-w-sm px-4 py-4">
                    <pre className="whitespace-pre-wrap break-words text-xs">
                      {JSON.stringify(log.details ?? {}, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && pagination && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {logs.length} of {pagination.total} audit logs
            {isFetching ? " · Updating..." : ""}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() =>
                updateUrl({
                  page: page <= 2 ? null : String(page - 1),
                })
              }
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || isFetching}
              onClick={() => updateUrl({ page: String(page + 1) })}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function AdminAuditLogsContent() {
  const searchParams = useSearchParams();
  const searchKey = searchParams.get("search") ?? "";

  return <AdminAuditLogsView key={searchKey} />;
}

export default function AdminAuditLogsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-40 items-center justify-center gap-2 rounded-xl border">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading audit logs...
          </span>
        </div>
      }
    >
      <AdminAuditLogsContent />
    </Suspense>
  );
}
