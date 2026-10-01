"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getBloodRequestById,
  updateBloodRequest,
} from "@/src/features/blood-requests/blood-requests.api";
import {
  bloodRequestSchema,
  type BloodRequestFormValues,
} from "@/src/validations/blood-request.validation";

export default function EditBloodRequestPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const requestId = params.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blood-request", requestId],
    queryFn: () => getBloodRequestById(requestId),
    enabled: Boolean(requestId),
  });

  const updateMutation = useMutation({
    mutationFn: (formData: BloodRequestFormValues) =>
      updateBloodRequest(requestId, {
        ...formData,
        requiredDate: new Date(
          `${formData.requiredDate}T00:00:00`,
        ).toISOString(),
      }),

    onSuccess: () => {
      toast.success("Blood request updated successfully.");
      router.push(`/requester/requests/${requestId}`);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update request.");
    },
  });

  const form = useForm<BloodRequestFormValues>({
    resolver: zodResolver(bloodRequestSchema),
    values: data?.data
      ? {
          bloodGroup: data.data.bloodGroup,
          units: data.data.units,
          amount: Number(data.data.amount),
          hospitalName: data.data.hospitalName,
          hospitalAddress: data.data.hospitalAddress,
          city: data.data.city,
          requiredDate: data.data.requiredDate.slice(0, 10),
          urgency: data.data.urgency,
          isPriority: data.data.isPriority,
          description: data.data.description ?? "",
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-96 animate-pulse rounded-xl border bg-background" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-4">
        <Link
          href={`/requester/requests/${requestId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Request
        </Link>

        <div className="rounded-xl border bg-background p-6">
          <h1 className="text-xl font-semibold">
            Unable to load request
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = (formData: BloodRequestFormValues) => {
    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/requester/requests/${requestId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Request
        </Link>

        <h1 className="mt-4 text-2xl font-bold">
          Edit Blood Request
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update the information for your blood request.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-xl border bg-background p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Blood Group
            </label>

            <select
              {...form.register("bloodGroup")}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Units</label>

            <input
              type="number"
              {...form.register("units", {
                valueAsNumber: true,
              })}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />

            {form.formState.errors.units && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.units.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Hospital Name
            </label>

            <input
              {...form.register("hospitalName")}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>

            <input
              {...form.register("city")}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Hospital Address
            </label>

            <input
              {...form.register("hospitalAddress")}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Required Date
            </label>

            <input
              type="date"
              {...form.register("requiredDate")}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Amount</label>

            <input
              type="number"
              step="0.01"
              {...form.register("amount", {
                valueAsNumber: true,
              })}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Urgency</label>

            <select
              {...form.register("urgency")}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Urgent</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-7">
            <input
              id="isPriority"
              type="checkbox"
              {...form.register("isPriority")}
              className="h-4 w-4"
            />

            <label
              htmlFor="isPriority"
              className="text-sm font-medium"
            >
              Mark as priority request
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              {...form.register("description")}
              rows={4}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href={`/requester/requests/${requestId}`}
            className="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
