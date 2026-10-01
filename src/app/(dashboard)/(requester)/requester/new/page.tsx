"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Droplets,
  Hospital,
  MapPin,
  Send,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createBloodRequest } from "@/src/features/blood-requests/blood-requests.api";

import {
  bloodRequestSchema,
  type BloodRequestFormValues,
} from "@/src/validations/blood-request.validation";

const defaultValues: BloodRequestFormValues = {
  bloodGroup: "A_POSITIVE",
  units: 1,
  amount: 0,
  hospitalName: "",
  hospitalAddress: "",
  city: "",
  requiredDate: "",
  urgency: "NORMAL",
  isPriority: false,
  description: "",
};

const bloodGroups = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
] as const;

const getBloodGroupLabel = (value: string) => {
  return bloodGroups.find((group) => group.value === value)?.label ?? value;
};

const formatLabel = (value: string) => {
  return value.charAt(0) + value.slice(1).toLowerCase();
};

const formatDate = (value: string) => {
  if (!value) return "Not provided";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
};

export default function CreateBloodRequestPage() {
  const [step, setStep] = useState(1);

  const router = useRouter();

  const createRequestMutation = useMutation({
    mutationFn: createBloodRequest,

    onSuccess: () => {
      toast.success("Blood request created successfully.");

      router.push("/requester/requests");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create blood request.");
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<BloodRequestFormValues>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues,
  });

  const formValues = watch();

  const handleNext = async () => {
    const fields =
      step === 1
        ? (["bloodGroup", "units", "urgency", "isPriority"] as const)
        : ([
            "hospitalName",
            "hospitalAddress",
            "city",
            "requiredDate",
            "amount",
          ] as const);

    const isValid = await trigger(fields);

    if (isValid) {
      setStep((current) => current + 1);
    }
  };

  // const onSubmit = (data: BloodRequestFormValues) => {
  //   createRequestMutation.mutate(data);
  // };

  const onSubmit = (data: BloodRequestFormValues) => {
    const payload = {
      ...data,
      requiredDate: new Date(`${data.requiredDate}T00:00:00`).toISOString(),
    };
    createRequestMutation.mutate(payload);
  };
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Requester Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Create Blood Request
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Provide the details needed to find a blood donor.
        </p>
      </div>

      {/* Step indicator */}
      <div className="rounded-xl border bg-background p-4">
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-1 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= item
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item}
              </div>

              {item < 3 && (
                <div
                  className={`h-1 flex-1 rounded-full ${
                    step > item ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 text-center text-xs text-muted-foreground">
          <span>Blood Details</span>
          <span>Hospital Details</span>
          <span>Review</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border bg-background p-6 shadow-sm"
      >
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">Blood Details</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us what type of blood is needed.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bloodGroup" className="text-sm font-medium">
                Blood Group
              </label>

              <select
                id="bloodGroup"
                {...register("bloodGroup")}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {bloodGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>

              {errors.bloodGroup && (
                <p className="text-sm text-destructive">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="units" className="text-sm font-medium">
                Blood Units
              </label>

              <input
                id="units"
                type="number"
                min={1}
                max={10}
                {...register("units", {
                  valueAsNumber: true,
                })}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              {errors.units && (
                <p className="text-sm text-destructive">
                  {errors.units.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="urgency" className="text-sm font-medium">
                Urgency
              </label>

              <select
                id="urgency"
                {...register("urgency")}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="CRITICAL">Critical</option>
              </select>

              {errors.urgency && (
                <p className="text-sm text-destructive">
                  {errors.urgency.message}
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                {...register("isPriority")}
                className="h-4 w-4 rounded"
              />

              <div>
                <p className="text-sm font-medium">Mark as priority request</p>

                <p className="text-xs text-muted-foreground">
                  Use this when the request needs extra attention.
                </p>
              </div>
            </label>

            <div className="flex justify-end border-t pt-5">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Hospital className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">Hospital Details</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us where the blood is needed.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="hospitalName" className="text-sm font-medium">
                Hospital Name
              </label>

              <input
                id="hospitalName"
                type="text"
                placeholder="e.g. Chittagong Medical College Hospital"
                {...register("hospitalName")}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              {errors.hospitalName && (
                <p className="text-sm text-destructive">
                  {errors.hospitalName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="hospitalAddress" className="text-sm font-medium">
                Hospital Address
              </label>

              <textarea
                id="hospitalAddress"
                rows={3}
                placeholder="Enter the complete hospital address"
                {...register("hospitalAddress")}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              {errors.hospitalAddress && (
                <p className="text-sm text-destructive">
                  {errors.hospitalAddress.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="city"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <MapPin className="h-4 w-4" />
                City
              </label>

              <input
                id="city"
                type="text"
                placeholder="e.g. Chattogram"
                {...register("city")}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              {errors.city && (
                <p className="text-sm text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="requiredDate"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <CalendarDays className="h-4 w-4" />
                  Required Date
                </label>

                <input
                  id="requiredDate"
                  type="date"
                  {...register("requiredDate")}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />

                {errors.requiredDate && (
                  <p className="text-sm text-destructive">
                    {errors.requiredDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Request Amount (BDT)
                </label>

                <input
                  id="amount"
                  type="number"
                  min={0}
                  step="0.01"
                  {...register("amount", {
                    valueAsNumber: true,
                  })}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />

                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Additional Details
              </label>

              <textarea
                id="description"
                rows={4}
                placeholder="Add any important information for potential donors..."
                {...register("description")}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Review
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">Review Request</h2>
                <p className="text-sm text-muted-foreground">
                  Check everything before submitting your request.
                </p>
              </div>
            </div>

            {/* Blood information */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Blood Details</h3>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                  <p className="mt-1 font-medium">
                    {getBloodGroupLabel(formValues.bloodGroup)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Units</p>
                  <p className="mt-1 font-medium">{formValues.units}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Urgency</p>
                  <p className="mt-1 font-medium">
                    {formatLabel(formValues.urgency)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Priority</p>
                <p className="mt-1 font-medium">
                  {formValues.isPriority ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Hospital information */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Hospital className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Hospital Details</h3>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Hospital</p>
                  <p className="mt-1 font-medium">{formValues.hospitalName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="mt-1 flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    {formValues.city}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="mt-1 text-sm">{formValues.hospitalAddress}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Required Date</p>
                <p className="mt-1 flex items-center gap-1 font-medium">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(formValues.requiredDate)}
                </p>
              </div>
            </div>

            {/* Payment/request amount */}
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Request Amount</p>

              <p className="mt-1 text-xl font-bold">
                ৳{formValues.amount.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            {formValues.description && (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Additional Details
                </p>

                <p className="mt-1 text-sm">{formValues.description}</p>
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-5">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="submit"
                disabled={createRequestMutation.isPending}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createRequestMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
