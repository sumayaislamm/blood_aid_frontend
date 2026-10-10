
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, Search } from "lucide-react";
import {
  getAdminPayments,
  type AdminPaymentStatus,
  type AdminPaymentProvider,
} from "@/src/features/admin/admin.api";

const statusStyles: Record<AdminPaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-purple-100 text-purple-800",
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: string | number, currency: string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return `${amount} ${currency}`;

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency || "BDT",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | AdminPaymentStatus>("ALL");
  const [provider, setProvider] = useState<"ALL" | AdminPaymentProvider>("ALL");

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["admin-payments", page, search, status, provider],
    queryFn: () =>
      getAdminPayments({
        page,
        limit: 10,
        search: search || undefined,
        status: status === "ALL" ? undefined : status,
        provider: provider === "ALL" ? undefined : provider,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });

  const payments = data?.data?.payments ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  function applySearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review payment transactions, providers, and payment statuses.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total matching payments</p>
          <p className="text-2xl font-bold">{pagination?.total ?? 0}</p>
          <p className="text-xs text-muted-foreground">
            Current page: {page} / {totalPages}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <form onSubmit={applySearch} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search payments..."
            aria-label="Search payments"
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>

        <select
          aria-label="Filter by provider"
          value={provider}
          onChange={(event) => {
            setProvider(event.target.value as "ALL" | AdminPaymentProvider);
            setPage(1);
          }}
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="ALL">All providers</option>
          <option value="STRIPE">Stripe</option>
          <option value="BKASH">bKash</option>
        </select>

        <select
          aria-label="Filter by payment status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "ALL" | AdminPaymentStatus);
            setPage(1);
          }}
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
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
          <span className="text-sm text-muted-foreground">Loading payments...</span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 p-6">
          <p className="font-semibold text-destructive">Unable to load payments.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the connection and API response, then try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Try again
          </button>
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-semibold">No payments found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Requester</th>
                  <th className="px-4 py-3 font-semibold">Blood request</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Provider</th>
                  <th className="px-4 py-3 font-semibold">Transaction</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Paid at</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {payment.requester?.name ?? "Requester unavailable"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {payment.requester?.email ?? "—"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {payment.bloodRequest?.bloodGroup ?? "—"}
                      </p>
                      <p className="mt-1">
                        {payment.bloodRequest?.hospitalName ?? "Request unavailable"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {payment.bloodRequest?.city ?? ""}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-medium">
                      {formatAmount(payment.amount, payment.currency)}
                    </td>

                    <td className="px-4 py-4">{payment.provider}</td>

                    <td className="max-w-40 break-all px-4 py-4 text-xs">
                      {payment.transactionId ?? "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {formatDate(payment.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {formatDate(payment.paidAt)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[payment.status]}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {payments.length} of {pagination?.total ?? payments.length} payments
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
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
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
