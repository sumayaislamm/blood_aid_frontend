"use client";
import { useQuery } from "@tanstack/react-query";
import { Droplets, Loader2, MapPin, CalendarDays } from "lucide-react";
import { getBloodRequests } from "@/src/features/blood-requests/blood-requests.api";
import { useState } from "react";
import { createDonorResponse } from "@/src/features/donor-responses/donor-responses.api";
import { toast } from "sonner";

function formatBloodGroup(bloodGroup: string) {
  return bloodGroup.replace("_", " ");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export default function DonorRequestsPage() {
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blood-requests"],
    queryFn: getBloodRequests,
  });

  const requests = data?.data ?? [];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Donor Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Emergency Blood Requests
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Find people who need blood and help save a life.
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
            Unable to load blood requests
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      )}

      {!isLoading && !isError && requests.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <Droplets className="mx-auto h-10 w-10 text-primary" />

          <h2 className="mt-4 font-semibold">No blood requests available</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            There are currently no active blood requests.
          </p>
        </div>
      )}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border bg-background p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Droplets className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      {formatBloodGroup(request.bloodGroup)}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.units} {request.units === 1 ? "unit" : "units"}{" "}
                      needed
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  {request.urgency}
                </span>
              </div>
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
                <p className="text-sm font-medium">{request.hospitalName}</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {request.hospitalAddress}
                </p>
              </div>
              {/* <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Respond to Request
                </button>
              </div> */}

              <div className="mt-5">
                {respondingId === request.id ? (
                  <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                    <div>
                      <label
                        htmlFor={`message-${request.id}`}
                        className="text-sm font-medium"
                      >
                        Message
                      </label>

                      <textarea
                        id={`message-${request.id}`}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Write a short message to the requester..."
                        rows={3}
                        className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRespondingId(null);
                          setMessage("");
                        }}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={async () => {
                          try {
                            setIsSubmitting(true);

                            await createDonorResponse({
                              bloodRequestId: request.id,
                              ...(message.trim()
                                ? { message: message.trim() }
                                : {}),
                            });

                            toast.success("Response sent successfully.");

                            setRespondingId(null);
                            setMessage("");
                          } catch (error) {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Failed to send response.",
                            );
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? "Sending..." : "Send Response"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setRespondingId(request.id)}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Respond to Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
