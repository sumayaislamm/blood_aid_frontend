"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Droplets, Loader2, MapPin, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  createDonorProfile,
  getMyDonorProfile,
  CreateDonorProfileInput,
} from "@/src/features/donor/donor-profile.api";

export default function DonorProfilePage() {
  const queryClient = useQueryClient();

  const [bloodGroup, setBloodGroup] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [lastDonationDate, setLastDonationDate] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [area, setArea] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-donor-profile"],
    queryFn: getMyDonorProfile,
  });

  const profile = data?.data;

  const createProfileMutation = useMutation({
    mutationFn: createDonorProfile,

    onSuccess: () => {
      toast.success("Donor profile created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["my-donor-profile"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create donor profile.");
    },
  });

  //   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  //     event.preventDefault();

  //     if (!bloodGroup) {
  //       toast.error("Please select your blood group.");
  //       return;
  //     }

  //     createProfileMutation.mutate({
  //       bloodGroup,
  //       ...(dateOfBirth ? { dateOfBirth } : {}),
  //       ...(gender ? { gender } : {}),
  //       ...(address.trim() ? { address: address.trim() } : {}),
  //       ...(city.trim() ? { city: city.trim() } : {}),
  //       ...(lastDonationDate
  //         ? { lastDonationDate }
  //         : {}),
  //       isAvailable,
  //     });
  //   }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!bloodGroup) {
      toast.error("Please select your blood group.");
      return;
    }

    if (!dateOfBirth) {
      toast.error("Please select your date of birth.");
      return;
    }

    if (!gender) {
      toast.error("Please select your gender.");
      return;
    }

    if (!city.trim()) {
      toast.error("Please enter your city.");
      return;
    }

    if (!area.trim()) {
      toast.error("Please enter your area.");
      return;
    }

    createProfileMutation.mutate({
      bloodGroup: bloodGroup as CreateDonorProfileInput["bloodGroup"],
      dateOfBirth: new Date(`${dateOfBirth}T00:00:00`).toISOString(),
      gender: gender as CreateDonorProfileInput["gender"],
      city: city.trim(),
      area: area.trim(),
      ...(lastDonationDate
        ? {
            lastDonationDate: new Date(
              `${lastDonationDate}T00:00:00`,
            ).toISOString(),
          }
        : {}),
    });
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Donor Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Donor Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your donor information and availability.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-xl border p-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && profile && (
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
              <p className="text-sm text-muted-foreground">Availability</p>

              <p className="mt-2 font-semibold">
                {profile.isAvailable ? "Available" : "Not Available"}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />

                <p className="text-sm text-muted-foreground">City</p>
              </div>

              <p className="mt-2 font-semibold">
                {profile.city || "Not provided"}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Gender</p>

              <p className="mt-2 font-semibold">
                {profile.gender || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Address</p>

            <p className="mt-2 font-medium">
              {profile.address || "Not provided"}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !profile && (
        <form
          onSubmit={handleSubmit}
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
                value={bloodGroup}
                onChange={(event) => setBloodGroup(event.target.value)}
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
            </div>

            <div>
              <label htmlFor="gender" className="text-sm font-medium">
                Gender
              </label>

              <select
                id="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth
              </label>

              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="lastDonationDate" className="text-sm font-medium">
                Last Donation Date
              </label>

              <input
                id="lastDonationDate"
                type="date"
                value={lastDonationDate}
                onChange={(event) => setLastDonationDate(event.target.value)}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>

              <input
                id="city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Dhaka"
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="area" className="text-sm font-medium">
                Area
              </label>

              <input
                id="area"
                type="text"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="e.g. Mirpur, Dhanmondi, Uttara"
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>

              <input
                id="address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Your address"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <label className="mt-5 flex items-center gap-3">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(event) => setIsAvailable(event.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-sm">
              I am currently available to donate blood
            </span>
          </label>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={createProfileMutation.isPending}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createProfileMutation.isPending
                ? "Creating..."
                : "Create Profile"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
