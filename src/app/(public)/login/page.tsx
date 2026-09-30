"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/src/stores/auth.store";
import { loginUser } from "@/src/features/auth/auth.api";
import { setAuthCookie } from "@/src/lib/auth-cookie";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      const response = await loginUser(data);

      if (!response.success) {
        throw new Error(response.message);
      }

      setAuth(response.data.user, response.data.token);
      setAuthCookie(response.data.token);

      toast.success("Login successful!");

      const role = response.data.user.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "DONOR") {
        router.push("/donor");
      } else {
        router.push("/requester");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Welcome to Blood Aid</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
