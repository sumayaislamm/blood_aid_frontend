"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Droplets } from "lucide-react";

import { apiFetch } from "@/src/lib/api";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
    role: z.enum(["DONOR", "REQUESTER"]),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: "DONOR" | "REQUESTER";
    status: "ACTIVE" | "BLOCKED" | "DELETED";
    createdAt: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "DONOR",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      const { confirmPassword: _, ...registerData } = data;

      await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(registerData),
      });

      toast.success("Account created successfully!");

      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      {" "}
      <div className="w-full max-w-md">
        {" "}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {" "}
          <ArrowLeft className="h-4 w-4" />
          Back to home{" "}
        </Link>
        <div className="rounded-xl border bg-background p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>

            <h1 className="mt-4 text-2xl font-bold">
              Create your Blood Aid account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Join the platform as a donor or requester.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium"
              >
                Full name
              </label>

              <input
                id="name"
                {...register("name")}
                placeholder="Your full name"
                className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              />

              {errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium"
              >
                Phone <span className="text-muted-foreground">(optional)</span>
              </label>

              <input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-1.5 block text-sm font-medium"
              >
                I want to
              </label>

              <select
                id="role"
                {...register("role")}
                className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              >
                <option value="DONOR">Donate blood</option>
                <option value="REQUESTER">Request blood</option>
              </select>

              {errors.role && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="At least 6 characters"
                className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              />

              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Re-enter your password"
                className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
