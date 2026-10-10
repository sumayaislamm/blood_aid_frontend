"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCurrentUser,
  updateCurrentUser,
} from "@/src/features/auth/auth.api";
import { useAuthStore } from "@/src/stores/auth.store";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  RefreshCw,
} from "lucide-react";

type ProfileUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>["data"]
>;

export default function RequesterProfilePage() {
  const profileQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  const user = profileQuery.data?.data;

  if (profileQuery.isLoading) {
    return (
      <main className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-xl border bg-background" />
      </main>
    );
  }

  if (profileQuery.isError || !user) {
    return (
      <main className="rounded-xl border bg-background p-6">
        <h1 className="text-xl font-bold">Requester Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unable to load your profile.
        </p>

        <button
          type="button"
          onClick={() => profileQuery.refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </main>
    );
  }

  return <RequesterProfileForm key={user.id} user={user} />;
}

function RequesterProfileForm({ user }: { user: ProfileUser }) {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");

  const updateMutation = useMutation({
    mutationFn: () =>
      updateCurrentUser({
        name: name.trim(),
        phone: phone.trim() || null,
      }),

    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(["current-user"], response);

        if (token) {
          setAuth(response.data, token);
        }
      }

      toast.success("Profile updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to update profile.",
      );
    },
  });

  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-8">
      <div>
        <p className="text-sm text-muted-foreground">Account Settings</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and update your account information.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        <div className="flex items-center gap-4 border-b bg-rose-50/70 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <UserRound className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">
              {user.role === "REQUESTER" ? "Blood Requester" : user.role}
            </p>
          </div>
        </div>

        <form
          className="space-y-5 p-6"
          onSubmit={(event) => {
            event.preventDefault();

            if (name.trim().length < 2) {
              toast.error("Name must be at least 2 characters.");
              return;
            }

            updateMutation.mutate();
          }}
        >
          <div className="space-y-2">
            <label htmlFor="profile-name" className="text-sm font-medium">
              Full Name
            </label>

            <div className="relative">
              <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                className="w-full rounded-md border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-email" className="text-sm font-medium">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="profile-email"
                type="email"
                value={user.email}
                readOnly
                className="w-full cursor-not-allowed rounded-md border bg-muted/50 py-2.5 pl-9 pr-3 text-sm text-foreground"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Email address cannot be changed here.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-phone" className="text-sm font-medium">
              Phone Number
            </label>

            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-md border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-sm text-muted-foreground">{user.status}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
}
