"use client";

import {
  ArrowLeft,
  CalendarDays,
  Droplets,
  Hospital,
  Loader2,
  MapPin,
  Pencil,
  Syringe,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  deleteBloodRequest,
  getBloodRequestById,
  getBloodRequestResponses,
  updateDonorResponseStatus,
} from "@/src/features/blood-requests/blood-requests.api";
import { useRouter } from "next/navigation";

function formatBloodGroup(bloodGroup: string) {
  return bloodGroup.replace("_", " ");
}

function formatStatus(status: string) {
  return status.replace("_", " ");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function getStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "MATCHED":
      return "bg-blue-100 text-blue-800";
    case "FULFILLED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700";
    case "EXPIRED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getUrgencyClass(urgency: string) {
  switch (urgency) {
    case "CRITICAL":
      return "bg-red-100 text-red-800";
    case "URGENT":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-green-100 text-green-800";
  }
}

export default function BloodRequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const requestId = params.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blood-request", requestId],
    queryFn: () => getBloodRequestById(requestId),
    enabled: Boolean(requestId),
  });

  const request = data?.data;

  const router = useRouter();

  const queryClient = useQueryClient();

  const responseStatusMutation = useMutation({
    mutationFn: ({
      responseId,
      status,
    }: {
      responseId: string;
      status: "ACCEPTED" | "REJECTED";
    }) => updateDonorResponseStatus(responseId, status),

    onSuccess: () => {
      toast.success("Donor response status updated.");

      queryClient.invalidateQueries({
        queryKey: ["blood-request-responses", requestId],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update donor response.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBloodRequest(requestId),

    onSuccess: () => {
      toast.success("Blood request deleted successfully.");
      router.push("/requester/requests");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete request.");
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blood request?",
    );

    if (!confirmed) return;

    deleteMutation.mutate();
  };

  const {
    data: responsesData,
    isLoading: responsesLoading,
    isError: responsesError,
  } = useQuery({
    queryKey: ["blood-request-responses", requestId],
    queryFn: () => getBloodRequestResponses(requestId),
    enabled: Boolean(requestId),
  });

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />

        <div className="h-80 animate-pulse rounded-xl border bg-background" />
      </section>
    );
  }

  if (isError || !request) {
    return (
      <section className="space-y-6">
        <Link
          href="/requester/requests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Blood Requests
        </Link>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h1 className="text-lg font-semibold text-destructive">
            Unable to load blood request
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            The request may not exist or you may not have access to it.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/requester/requests"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Blood Requests
          </Link>

          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Blood Request Details
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Review the complete information for this blood request.
          </p>
        </div>
        <div className="flex gap-3">
          {request.status === "PENDING" && (
            <Link href={`/requester/requests/${request.id}/edit`}>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit Request
              </button>
            </Link>
          )}
          {request.status === "PENDING" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-2 rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {deleteMutation.isPending ? "Deleting..." : "Delete Request"}
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Droplets className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {formatBloodGroup(request.bloodGroup)}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Request ID: {request.id}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getUrgencyClass(
                request.urgency,
              )}`}
            >
              {formatStatus(request.urgency)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                request.status,
              )}`}
            >
              {formatStatus(request.status)}
            </span>

            {request.isPriority && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                Priority
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Blood information */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Blood Information</h2>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Blood Group</p>
            <p className="mt-1 text-lg font-semibold">
              {formatBloodGroup(request.bloodGroup)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Units Needed</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
              <Syringe className="h-4 w-4 text-primary" />
              {request.units}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Request Amount</p>
            <p className="mt-1 text-lg font-semibold">
              {/* ৳{request.amount.toFixed(2)} */}৳
              {Number(request.amount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Hospital information */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Hospital className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Hospital Information</h2>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-xs text-muted-foreground">Hospital</p>
            <p className="mt-1 font-medium">{request.hospitalName}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="mt-1 text-sm">{request.hospitalAddress}</p>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">City</p>
              <p className="mt-1 font-medium">{request.city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Responses  */}

      <section className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Donor Responses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Donors who have responded to this blood request.
          </p>
        </div>

        {responsesLoading && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {responsesError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              Unable to load donor responses.
            </p>
          </div>
        )}

        {!responsesLoading &&
          !responsesError &&
          responsesData?.data?.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm font-medium">No donor responses yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Donor responses will appear here when someone responds.
              </p>
            </div>
          )}

        {!responsesLoading &&
          !responsesError &&
          responsesData?.data &&
          responsesData.data.length > 0 && (
            <div className="space-y-3">
              {responsesData.data.map((response) => (
                <div key={response.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {response.donor?.name ?? "Anonymous Donor"}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {response.donor?.email ?? "No email available"}
                      </p>

                      {response.donor?.phone && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {response.donor.phone}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {response.status}
                    </span>
                  </div>
                  {response.message && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {response.message}
                    </p>
                  )}
                
                  {response.status === "PENDING" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          responseStatusMutation.mutate({
                            responseId: response.id,
                            status: "ACCEPTED",
                          })
                        }
                        disabled={responseStatusMutation.isPending}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          responseStatusMutation.mutate({
                            responseId: response.id,
                            status: "REJECTED",
                          })
                        }
                        disabled={responseStatusMutation.isPending}
                        className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  
                </div>
              ))}
            </div>
          )}
      </section>
      {/* Date and description */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Required Date</h2>
          </div>

          <p className="mt-4 text-lg font-semibold">
            {formatDate(request.requiredDate)}
          </p>
        </div>

        {request.description && (
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <h2 className="font-semibold">Additional Details</h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {request.description}
            </p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="font-semibold">Request Information</h2>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">{formatDate(request.createdAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium">{formatDate(request.updatedAt)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
