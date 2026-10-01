"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  Droplets,
  HeartPulse,
  Loader2,
} from "lucide-react";

import {
  getMyDonations,
  getMyResponses,
} from "@/src/features/donor/donor.api";
import { useAuthStore } from "@/src/stores/auth.store";

export default function DonorDashboard() {
  const user = useAuthStore((state) => state.user);

  const responsesQuery = useQuery({
    queryKey: ["my-donor-responses"],
    queryFn: getMyResponses,
  });

  const donationsQuery = useQuery({
    queryKey: ["my-donations"],
    queryFn: getMyDonations,
  });

  const isLoading =
    responsesQuery.isLoading || donationsQuery.isLoading;

  const isError =
    responsesQuery.isError || donationsQuery.isError;

  const responses = responsesQuery.data?.data ?? [];
  const donations = donationsQuery.data?.data ?? [];

  const acceptedResponses = responses.filter(
    (response) => response.status === "ACCEPTED"
  ).length;

  const completedDonations = donations.filter(
    (donation) =>
      donation.status === "COMPLETED" ||
      donation.status === "VERIFIED"
  ).length;

  const cards = [
    {
      label: "Total Responses",
      value: responses.length,
      icon: ClipboardList,
    },
    {
      label: "Accepted Responses",
      value: acceptedResponses,
      icon: Droplets,
    },
    {
      label: "Completed Donations",
      value: completedDonations,
      icon: HeartPulse,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Donor Dashboard
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight">
          Welcome, {user?.name ?? "Donor"}!
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Help save lives by responding to blood requests.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border bg-background">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your dashboard...
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h3 className="font-semibold text-destructive">
            Unable to load your dashboard
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-xl border bg-background p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && responses.length === 0 && (
        <div className="rounded-xl border bg-background p-8 text-center">
          <Droplets className="mx-auto h-10 w-10 text-muted-foreground" />

          <h3 className="mt-3 font-semibold">
            No blood requests responded to yet
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Browse emergency requests and help someone in need.
          </p>
        </div>
      )}
    </section>
  );
}
