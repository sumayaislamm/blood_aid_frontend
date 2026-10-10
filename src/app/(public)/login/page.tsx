



"use client";

import { useEffect, useState } from "react";
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

const demoAccounts = [
  {
    label: "Demo Admin",
    email: "admin@bloodaid.com",
    password: "Admin56%%",
    role: "ADMIN",
  },
  {
    label: "Demo Donor",
    email: "sumaya@gmail.com",
    password: "Sumaya56%%",
    role: "DONOR",
  },
  {
    label: "Demo Requester",
    email: "rancy@bloodaid.com",
    password: "Rancy56%%",
    role: "REQUESTER",
  },
] as const;

function getDashboardPath(role: string) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "DONOR":
      return "/donor";
    case "REQUESTER":
      return "/requester";
    default:
      throw new Error("Unsupported account role.");
  }
}

export default function LoginPage() {
  const router = useRouter();

  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [isLoading, setIsLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !user) return;

    try {
      router.replace(getDashboardPath(user.role));
    } catch {
      toast.error("Your account has an unsupported role.");
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const performLogin = async (credentials: LoginFormData) => {
    const response = await loginUser(credentials);

    if (!response.success) {
      throw new Error(response.message || "Login failed. Please try again.");
    }

    const { user, token } = response.data;

    if (user.status !== "ACTIVE") {
      throw new Error("This account is not active.");
    }

    const dashboardPath = getDashboardPath(user.role);

    setAuth(user, token);
    setAuthCookie(token, user.role);

    return { user, dashboardPath };
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      const result = await performLogin(data);

      toast.success("Login successful!");
      router.replace(result.dashboardPath);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onDemoLogin = async (account: (typeof demoAccounts)[number]) => {
    try {
      setIsLoading(true);
      setActiveDemo(account.label);

      const result = await performLogin({
        email: account.email,
        password: account.password,
      });

      if (result.user.role !== account.role) {
        useAuthStore.getState().clearAuth();
        throw new Error("The demo account role does not match.");
      }

      toast.success(`${account.label} login successful!`);
      router.replace(result.dashboardPath);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Demo login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setActiveDemo(null);
    }
  };

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (isAuthenticated && user) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Welcome to Blood Aid</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-sm font-semibold">Quick Demo Login</p>

          {demoAccounts.map((account) => (
            <button
              key={account.role}
              type="button"
              disabled={isLoading}
              onClick={() => onDemoLogin(account)}
              className="w-full rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeDemo === account.label
                ? "Signing in..."
                : account.label}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign in with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
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
