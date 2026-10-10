// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { Loader2, RefreshCw } from "lucide-react";
// import { getAdminAuditLogs } from "@/src/features/admin/admin.api";

// function formatDate(value: string) {
//   return new Date(value).toLocaleString();
// }

// export default function AdminAuditLogsPage() {
//   const { data, isLoading, isError, refetch, isFetching } = useQuery({
//     queryKey: ["admin-audit-logs"],
//     queryFn: getAdminAuditLogs,
//   });

//   const logs = data?.data?.auditLogs ?? [];
//   const pagination = data?.data?.pagination;

//   return (
//     <section className="space-y-6">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <p className="text-sm text-muted-foreground">Administration</p>
//           <h1 className="mt-1 text-2xl font-bold tracking-tight">
//             Audit Logs
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Review administrative actions and donation verification history.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => refetch()}
//           disabled={isFetching}
//           className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
//         >
//           <RefreshCw
//             className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
//           />
//           Refresh
//         </button>
//       </div>

//       {pagination && (
//         <div className="rounded-xl border p-4">
//           <p className="text-sm text-muted-foreground">Total audit logs</p>
//           <p className="mt-1 text-2xl font-bold">{pagination.total}</p>
//         </div>
//       )}

//       {isLoading ? (
//         <div className="flex min-h-40 items-center justify-center gap-2 rounded-xl border">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           <span className="text-sm text-muted-foreground">
//             Loading audit logs...
//           </span>
//         </div>
//       ) : isError ? (
//         <div className="rounded-xl border border-destructive/30 p-6">
//           <p className="font-semibold text-destructive">
//             Unable to load audit logs.
//           </p>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Please check your connection and try again.
//           </p>
//           <button
//             type="button"
//             onClick={() => refetch()}
//             className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
//           >
//             Try again
//           </button>
//         </div>
//       ) : logs.length === 0 ? (
//         <div className="rounded-xl border p-8 text-center">
//           <p className="font-semibold">No audit logs found</p>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Administrative actions will appear here when recorded.
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border">
//           <table className="w-full min-w-[750px] text-left text-sm">
//             <thead className="border-b bg-muted/50">
//               <tr>
//                 <th className="px-4 py-3 font-semibold">Date & Time</th>
//                 <th className="px-4 py-3 font-semibold">Admin</th>
//                 <th className="px-4 py-3 font-semibold">Action</th>
//                 <th className="px-4 py-3 font-semibold">Entity</th>
//                 <th className="px-4 py-3 font-semibold">Details</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">
//               {logs.map((log) => (
//                 <tr key={log.id} className="align-top">
//                   <td className="whitespace-nowrap px-4 py-4">
//                     {formatDate(log.createdAt)}
//                   </td>
//                   <td className="px-4 py-4">
//                     <p className="font-medium">
//                       {log.user?.name ?? "Unknown"}
//                     </p>
//                     <p className="mt-1 text-xs text-muted-foreground">
//                       {log.user?.email ?? "No email"}
//                     </p>
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold">
//                       {log.action}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <p className="font-medium">{log.entity}</p>
//                     <p className="mt-1 break-all text-xs text-muted-foreground">
//                       {log.entityId}
//                     </p>
//                   </td>
//                   <td className="max-w-sm px-4 py-4">
//                     <pre className="whitespace-pre-wrap break-words text-xs">
//                       {JSON.stringify(log.details ?? {}, null, 2)}
//                     </pre>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {pagination && pagination.totalPages > 1 && (
//         <p className="text-sm text-muted-foreground">
//           Showing the current page of {pagination.total} audit logs.
//           Pagination controls can be added later.
//         </p>
//       )}
//     </section>
//   );
// }




"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { getAdminAuditLogs } from "@/src/features/admin/admin.api";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-audit-logs", page, search, action, entity],
    queryFn: () =>
      getAdminAuditLogs({
        page,
        limit: 10,
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
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Administration
          </p>

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
          onChange={(event) => {
            setAction(event.target.value);
            setPage(1);
          }}
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
          onChange={(event) => {
            setEntity(event.target.value);
            setPage(1);
          }}
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
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
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
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1),
                )
              }
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
