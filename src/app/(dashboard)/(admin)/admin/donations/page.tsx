
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  getAdminDonations,
  verifyDonation,
  type AdminDonationItem,
} from "@/src/features/admin/admin.api";

type DonationStatus = "PENDING" | "COMPLETED" | "VERIFIED" | "CANCELLED";

const PAGE_SIZE = 10;

const validStatuses: DonationStatus[] = [
  "PENDING",
  "COMPLETED",
  "VERIFIED",
  "CANCELLED",
];

const statusStyles: Record<DonationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function formatDate(value: string) {
  const date = value.slice(0, 10);
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function DebouncedInput({
  initialValue,
  onDebouncedChange,
  placeholder,
  ariaLabel,
}: {
  initialValue: string;
  onDebouncedChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  const [draft, setDraft] = useState(initialValue);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (draft.trim() !== initialValue) {
        onDebouncedChange(draft.trim());
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [draft, initialValue, onDebouncedChange]);

  return (
    <input
      type="search"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full rounded-lg border bg-background px-3 py-2 text-sm sm:w-72"
    />
  );
}

function AdminDonationsContent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const rawStatus = searchParams.get("status") ?? "ALL";
  const statusFilter = validStatuses.includes(rawStatus as DonationStatus)
    ? (rawStatus as DonationStatus)
    : "ALL";

  const parsedPage = Number(searchParams.get("page") ?? "1");
  const page =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [feedback, setFeedback] = useState("");

  const updateUrl = useCallback(
    (updates: Record<string, string | null>, resetPage = false) => {
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

  const handleSearchChange = useCallback(
    (value: string) => {
      if (value !== search) {
        updateUrl({ search: value || null }, true);
      }
    },
    [search, updateUrl],
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-donations", { page, limit: PAGE_SIZE, search, status: statusFilter }],
    queryFn: () =>
      getAdminDonations({
        page,
        limit: PAGE_SIZE,
        search,
        status: statusFilter,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    placeholderData: keepPreviousData,
  });

  const donations = data?.data?.donations ?? [];
  const pagination = data?.data?.pagination;

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 0;
  const currentPage = pagination?.page ?? page;

  const verifyMutation = useMutation({
    mutationFn: verifyDonation,
    onSuccess: async () => {
      setFeedback("Donation verified successfully.");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-donations"],
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
          : "Unable to verify donation. Please try again.",
      );
    },
  });

  const handleVerify = (donation: AdminDonationItem) => {
    const confirmed = window.confirm(
      "Are you sure you want to verify this donation?",
    );

    if (confirmed) {
      setFeedback("");
      verifyMutation.mutate(donation.id);
    }
  };

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || (totalPages > 0 && nextPage > totalPages)) {
      return;
    }

    updateUrl({ page: nextPage === 1 ? null : String(nextPage) });
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Administration</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">Donations</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review donations and verify completed donations.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {statusFilter === "ALL"
              ? "Total donations"
              : `${statusFilter.toLowerCase()} donations`}
          </p>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DebouncedInput
            key={search}
            initialValue={search}
            onDebouncedChange={handleSearchChange}
            placeholder="Search donations..."
            ariaLabel="Search donations"
          />

          <div className="flex items-center gap-2">
            <label
              htmlFor="donation-status"
              className="text-sm font-medium"
            >
              Status
            </label>

            <select
              id="donation-status"
              value={statusFilter}
              onChange={(event) => {
                const value = event.target.value;
                updateUrl(
                  { status: value === "ALL" ? null : value },
                  true,
                );
              }}
              className="rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="VERIFIED">Verified</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className="rounded-lg border bg-background p-3 text-sm"
        >
          {feedback}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center gap-2 rounded-xl border">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading donations...
          </span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 p-6">
          <p className="font-semibold text-destructive">
            Unable to load donations.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try refreshing.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Try again
          </button>
        </div>
      ) : donations.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-semibold">No donations found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No donations match your search or selected status.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-212.5 text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Donor</th>
                  <th className="px-4 py-3 font-semibold">Blood request</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Units</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {donations.map((donation) => (
                  <tr key={donation.id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {donation.donor?.name ?? "Unknown donor"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {donation.donor?.email ?? "No email"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {donation.bloodRequest?.bloodGroup ?? "N/A"}
                      </p>
                      <p className="mt-1">
                        {donation.bloodRequest?.hospitalName ?? "N/A"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {donation.bloodRequest?.city ?? "N/A"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {formatDate(donation.donationDate)}
                    </td>

                    <td className="px-4 py-4">{donation.units}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[donation.status]}`}
                      >
                        {donation.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {donation.status === "COMPLETED" ? (
                        <button
                          type="button"
                          onClick={() => handleVerify(donation)}
                          disabled={verifyMutation.isPending}
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                        >
                          {verifyMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="h-4 w-4" />
                          )}
                          Verify Donation
                        </button>
                      ) : donation.status === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {donation.status === "PENDING"
                            ? "Awaiting completion"
                            : "No action available"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {total === 0
                ? "No donations"
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                    currentPage * PAGE_SIZE,
                    total,
                  )} of ${total} donations`}
              {isFetching ? " · Updating..." : ""}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1 || isFetching}
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {Math.max(totalPages, 1)}
              </span>

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={
                  totalPages === 0 ||
                  currentPage >= totalPages ||
                  isFetching
                }
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function AdminDonationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-40 items-center justify-center gap-2 rounded-xl border">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading donations...
          </span>
        </div>
      }
    >
      <AdminDonationsContent />
    </Suspense>
  );
}
