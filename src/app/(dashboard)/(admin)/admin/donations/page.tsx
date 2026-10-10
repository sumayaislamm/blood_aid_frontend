"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

import {
  getAdminDonations,
  verifyDonation,
} from "@/src/features/admin/admin.api";

type DonationStatus = "PENDING" | "COMPLETED" | "VERIFIED" | "CANCELLED";

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

export default function AdminDonationsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [feedback, setFeedback] = useState("");

  // const {
  //   data,
  //   isLoading,
  //   isError,
  //   refetch,
  //   isFetching,
  // } = useQuery({
  //   queryKey: ["admin-donations"],
  //   queryFn: getAdminDonations,
  // });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: () => getAdminDonations(),
  });

  const donations = data?.data?.donations ?? [];
  const pagination = data?.data?.pagination;

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

  const filteredDonations =
    statusFilter === "ALL"
      ? donations
      : donations.filter((donation) => donation.status === statusFilter);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Administration</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">Donations</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review donations and verify completed donations.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total donations</p>
          <p className="text-2xl font-bold">
            {pagination?.total ?? donations.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="donation-status" className="text-sm font-medium">
            Status
          </label>

          <select
            id="donation-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
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
      ) : filteredDonations.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-semibold">No donations found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No donations match the selected status.
          </p>
        </div>
      ) : (
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
              {filteredDonations.map((donation) => (
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
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[donation.status]
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {donation.status === "COMPLETED" ? (
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Are you sure you want to verify this donation?",
                          );

                          if (confirmed) {
                            setFeedback("");
                            verifyMutation.mutate(donation.id);
                          }
                        }}
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
      )}

      {pagination && pagination.totalPages > 1 && (
        <p className="text-sm text-muted-foreground">
          Showing the current page of {pagination.total} donations. Pagination
          controls can be added next.
        </p>
      )}
    </section>
  );
}
