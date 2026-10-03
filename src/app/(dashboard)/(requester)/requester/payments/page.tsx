"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getMyBloodRequests } from "@/src/features/blood-requests/blood-requests.api";
import { initiatePayment } from "@/src/features/payments/payments.api";

export default function RequesterPaymentsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-blood-requests"],
    queryFn: getMyBloodRequests,
  });

  const paymentMutation = useMutation({
    mutationFn: (bloodRequestId: string) =>
      initiatePayment({
        bloodRequestId,
        provider: "STRIPE",
      }),

    onSuccess: (response) => {
      const checkoutUrl = response.data.checkoutUrl;

      if (!checkoutUrl) {
        toast.error("Stripe checkout URL was not returned.");
        return;
      }

      toast.success("Redirecting to Stripe...");

      window.location.href = checkoutUrl;
    },

    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to initiate payment.",
      );
    },
  });

  const bloodRequests = data?.data ?? [];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">
          Requester Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Payments
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Pay for your blood requests securely through Stripe.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center rounded-xl border p-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold">
            Unable to load your blood requests
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && bloodRequests.length === 0 && (
        <div className="rounded-xl border p-10 text-center">
          <CreditCard className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 font-semibold">
            No blood requests found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a blood request before making a payment.
          </p>
        </div>
      )}

      {/* Blood Requests */}
      {!isLoading &&
        !isError &&
        bloodRequests.length > 0 && (
          <div className="grid gap-5">
            {bloodRequests.map((request) => {
              const isPending =
                paymentMutation.isPending &&
                paymentMutation.variables === request.id;

              return (
                <div
                  key={request.id}
                  className="rounded-xl border bg-background p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-semibold">
                          {request.hospitalName}
                        </h2>

                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {request.bloodGroup.replace("_", " ")}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {request.hospitalAddress}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.city}
                      </p>
                    </div>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Units
                      </p>

                      <p className="mt-1 font-semibold">
                        {request.units}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Amount
                      </p>

                      <p className="mt-1 font-semibold">
                        ৳{request.amount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Required Date
                      </p>

                      <p className="mt-1 font-semibold">
                        {new Date(
                          request.requiredDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      disabled={paymentMutation.isPending}
                      onClick={() =>
                        paymentMutation.mutate(request.id)
                      }
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Pay with Stripe
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </section>
  );
}
