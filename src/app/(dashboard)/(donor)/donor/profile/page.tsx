
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Droplets, Loader2, MapPin, UserRound, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  createDonorProfile,
  getMyDonorProfile,
} from "@/src/features/donor/donor-profile.api";
import type { CreateDonorProfileInput } from "@/src/features/donor/donor-profile.api";

import {
  donorProfileSchema,
  type DonorProfileFormValues,
} from "@/src/lib/validations/donor.schemas";

function toUtcDateTime(value: string) {
  return `${value}T00:00:00.000Z`;
}

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export default function DonorProfilePage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorProfileFormValues>({
    resolver: zodResolver(donorProfileSchema),
    defaultValues: {
      bloodGroup: undefined,
      dateOfBirth: "",
      gender: undefined,
      city: "",
      area: "",
      lastDonationDate: "",
    },
  });

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["my-donor-profile"],
    queryFn: getMyDonorProfile,
  });

  const profile = data?.data;

  const createProfileMutation = useMutation({
    mutationFn: createDonorProfile,

    onSuccess: async () => {
      toast.success("Donor profile created successfully.");
      await queryClient.invalidateQueries({
        queryKey: ["my-donor-profile"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create donor profile.");
    },
  });

  const onSubmit = (values: DonorProfileFormValues) => {
    const payload: CreateDonorProfileInput = {
      bloodGroup: values.bloodGroup,
      dateOfBirth: toUtcDateTime(values.dateOfBirth),
      gender: values.gender,
      city: values.city.trim(),
      area: values.area.trim(),
      ...(values.lastDonationDate
        ? { lastDonationDate: toUtcDateTime(values.lastDonationDate) }
        : {}),
    };

    createProfileMutation.mutate(payload);
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Donor Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Donor Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your donor information.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-xl border p-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold">
            Unable to load your donor profile
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && profile && (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <UserRound className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Donor Profile</h2>
              <p className="text-sm text-muted-foreground">
                Your donor profile is active.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">Blood Group</p>
              </div>
              <p className="mt-2 font-semibold">
                {profile.bloodGroup.replace("_", " ")}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">City</p>
              </div>
              <p className="mt-2 font-semibold">{profile.city || "Not provided"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">Area</p>
              </div>
              <p className="mt-2 font-semibold">{profile.area || "Not provided"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="mt-2 font-semibold">{profile.gender || "Not provided"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="mt-2 font-semibold">{formatDate(profile.dateOfBirth)}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Last Donation</p>
              <p className="mt-2 font-semibold">
                {profile.lastDonationDate
                  ? formatDate(profile.lastDonationDate)
                  : "Not provided"}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && !profile && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="rounded-xl border bg-background p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Create Donor Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your information so requesters can find suitable donors.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="bloodGroup" className="text-sm font-medium">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                {...register("bloodGroup")}
                aria-invalid={!!errors.bloodGroup}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select blood group</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </select>
              {errors.bloodGroup && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="text-sm font-medium">
                Gender
              </label>
              <select
                id="gender"
                {...register("gender")}
                aria-invalid={!!errors.gender}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                aria-invalid={!!errors.dateOfBirth}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastDonationDate" className="text-sm font-medium">
                Last Donation Date
              </label>
              <input
                id="lastDonationDate"
                type="date"
                {...register("lastDonationDate")}
                aria-invalid={!!errors.lastDonationDate}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              {errors.lastDonationDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastDonationDate.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="text-sm font-medium">City</label>
              <input
                id="city"
                type="text"
                {...register("city")}
                placeholder="e.g. Dhaka"
                aria-invalid={!!errors.city}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="area" className="text-sm font-medium">Area</label>
              <input
                id="area"
                type="text"
                {...register("area")}
                placeholder="e.g. Mirpur, Dhanmondi, Uttara"
                aria-invalid={!!errors.area}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={createProfileMutation.isPending}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createProfileMutation.isPending ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
