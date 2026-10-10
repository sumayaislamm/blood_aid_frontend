
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Droplets, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getMyDonorResponses } from "@/src/features/donor-responses/donor-responses.api";
import { createDonation } from "@/src/features/donor/donor.api";
import {
  donationSchema,
  type DonationFormValues,
} from "@/src/lib/validations/donor.schemas";

function formatBloodGroup(bloodGroup: string) {
  return bloodGroup.replace("_", " ");
}

function formatDate(value: string) {
  const date = value.slice(0, 10);
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getStatusClass(status: string) {
  switch (status) {
    case "ACCEPTED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function DonorResponsesPage() {
  const queryClient = useQueryClient();

  const [donatingResponseId, setDonatingResponseId] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donationDate: "",
      units: 1,
      notes: "",
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-donor-responses"],
    queryFn: getMyDonorResponses,
  });

  const responses = data?.data ?? [];

  const handleCancel = () => {
    setDonatingResponseId(null);
    reset({
      donationDate: "",
      units: 1,
      notes: "",
    });
  };

  const handleCreateDonation = async (
    responseId: string,
    values: DonationFormValues,
  ) => {
    try {
      await createDonation(responseId, {
        donationDate: `${values.donationDate}T00:00:00.000Z`,
        units: values.units,
        ...(values.notes?.trim()
          ? { notes: values.notes.trim() }
          : {}),
      });

      toast.success("Donation created successfully.");

      setDonatingResponseId(null);
      reset({
        donationDate: "",
        units: 1,
        notes: "",
      });

      await queryClient.invalidateQueries({
        queryKey: ["my-donor-responses"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["my-donations"],
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create donation.",
      );
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Donor Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          My Responses
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track the blood requests you have responded to.
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
            Unable to load your responses
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      )}

      {!isLoading && !isError && responses.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <Droplets className="mx-auto h-10 w-10 text-primary" />

          <h2 className="mt-4 font-semibold">No responses yet</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your responses to blood requests will appear here.
          </p>
        </div>
      )}

      {!isLoading && !isError && responses.length > 0 && (
        <div className="grid gap-4">
          {responses.map((response) => {
            const request = response.bloodRequest;

            return (
              <div
                key={response.id}
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
                          : "Blood Request"}
                      </h2>

                      {request && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {request.units}{" "}
                          {request.units === 1 ? "unit" : "units"} needed
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(response.status)}`}
                  >
                    {response.status}
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
                        <span>{formatDate(request.requiredDate)}</span>
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

                {response.message && (
                  <div className="mt-4 rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Your Message
                    </p>

                    <p className="mt-1 text-sm">{response.message}</p>
                  </div>
                )}

                {response.status === "ACCEPTED" && !response.donation && (
                  <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                    {donatingResponseId === response.id ? (
                      <form
                        onSubmit={handleSubmit((values) =>
                          handleCreateDonation(response.id, values),
                        )}
                        className="space-y-4"
                      >
                        <div>
                          <label
                            htmlFor={`donation-date-${response.id}`}
                            className="text-sm font-medium"
                          >
                            Donation Date
                          </label>

                          <input
                            id={`donation-date-${response.id}`}
                            type="date"
                            {...register("donationDate")}
                            aria-invalid={!!errors.donationDate}
                            aria-describedby={
                              errors.donationDate
                                ? `donation-date-error-${response.id}`
                                : undefined
                            }
                            className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                          />

                          {errors.donationDate && (
                            <p
                              id={`donation-date-error-${response.id}`}
                              role="alert"
                              className="mt-1 text-sm text-destructive"
                            >
                              {errors.donationDate.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor={`donation-units-${response.id}`}
                            className="text-sm font-medium"
                          >
                            Units
                          </label>

                          <input
                            id={`donation-units-${response.id}`}
                            type="number"
                            min={1}
                            max={10}
                            step={1}
                            {...register("units", {
                              valueAsNumber: true,
                            })}
                            aria-invalid={!!errors.units}
                            aria-describedby={
                              errors.units
                                ? `donation-units-error-${response.id}`
                                : undefined
                            }
                            className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                          />

                          {errors.units && (
                            <p
                              id={`donation-units-error-${response.id}`}
                              role="alert"
                              className="mt-1 text-sm text-destructive"
                            >
                              {errors.units.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor={`donation-notes-${response.id}`}
                            className="text-sm font-medium"
                          >
                            Notes (Optional)
                          </label>

                          <textarea
                            id={`donation-notes-${response.id}`}
                            {...register("notes")}
                            placeholder="Optional donation notes..."
                            rows={3}
                            maxLength={1000}
                            aria-invalid={!!errors.notes}
                            aria-describedby={
                              errors.notes
                                ? `donation-notes-error-${response.id}`
                                : undefined
                            }
                            className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                          />

                          {errors.notes && (
                            <p
                              id={`donation-notes-error-${response.id}`}
                              role="alert"
                              className="mt-1 text-sm text-destructive"
                            >
                              {errors.notes.message}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-muted-foreground">
                            Maximum 1000 characters.
                          </p>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleCancel}
                            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSubmitting
                              ? "Creating..."
                              : "Create Donation"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            reset({
                              donationDate: "",
                              units: 1,
                              notes: "",
                            });
                            setDonatingResponseId(response.id);
                          }}
                          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                          Create Donation
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    Responded on{" "}
                    {formatDate(response.respondedAt ?? response.createdAt)}
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
