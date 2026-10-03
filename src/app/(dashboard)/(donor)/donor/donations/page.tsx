"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Droplets, Loader2, MapPin } from "lucide-react";

import { getMyDonations } from "@/src/features/donor/donor.api";
import { updateDonationStatus } from "@/src/features/donor/donor.api";
import { toast } from "sonner";

function formatBloodGroup(bloodGroup: string) {
  return bloodGroup.replace("_", " ");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function getStatusClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";

    case "VERIFIED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function DonorDonationsPage() {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({
      donationId,
      status,
    }: {
      donationId: string;
      status: "COMPLETED";
    }) => updateDonationStatus(donationId, status),

    onSuccess: () => {
      toast.success("Donation marked as completed.");

      queryClient.invalidateQueries({
        queryKey: ["my-donations"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update donation status.");
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-donations"],
    queryFn: getMyDonations,
  });

  const donations = data?.data ?? [];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Donor Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">My Donations</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track your blood donation history and status.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-xl border p-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load your donations
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      )}

      {!isLoading && !isError && donations.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <Droplets className="mx-auto h-10 w-10 text-primary" />

          <h2 className="mt-4 font-semibold">No donations yet</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your completed blood donations will appear here.
          </p>
        </div>
      )}

      {!isLoading && !isError && donations.length > 0 && (
        <div className="grid gap-4">
          {donations.map((donation) => {
            const request = donation.bloodRequest;

            return (
              <div
                key={donation.id}
                className="rounded-xl border bg-background p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Droplets className="h-6 w-6 text-primary" />
                    </div>

                    <div>
                      <h2 className="font-semibold">
                        {request
                          ? formatBloodGroup(request.bloodGroup)
                          : "Blood Donation"}
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {donation.units}{" "}
                        {donation.units === 1 ? "unit" : "units"} donated
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      donation.status,
                    )}`}
                  >
                    {donation.status}
                  </span>
                </div>

                {request && (
                  <>
                    <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />

                        <span>{request.city}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />

                        <span>{formatDate(donation.donationDate)}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium">
                        {request.hospitalName}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.hospitalAddress}
                      </p>
                    </div>
                  </>
                )}

                {donation.notes && (
                  <div className="mt-4 rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Notes
                    </p>

                    <p className="mt-1 text-sm">{donation.notes}</p>
                  </div>
                )}
                {donation.status === "PENDING" && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={updateStatusMutation.isPending}
                      onClick={() =>
                        updateStatusMutation.mutate({
                          donationId: donation.id,
                          status: "COMPLETED",
                        })
                      }
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updateStatusMutation.isPending
                        ? "Updating..."
                        : "Mark as Completed"}
                    </button>
                  </div>
                )}
                <div className="mt-4 border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    Donation recorded on {formatDate(donation.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
