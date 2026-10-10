
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth.store";
import {
  ArrowRight,
  Droplets,
  HeartPulse,
  ShieldCheck,
  Users,
  LogOut,
} from "lucide-react";
import { clearAuthCookie } from "@/src/lib/auth-cookie";

const features = [
  {
    icon: Droplets,
    title: "Emergency Blood Requests",
    description:
      "Create and manage urgent blood requests and connect with suitable donors.",
  },
  {
    icon: Users,
    title: "Connect With Donors",
    description:
      "Donors can discover blood requests and respond when they are available.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Role-based access and secure authentication protect every user's account.",
  },
];

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function HomePage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const dashboardPath = user
    ? {
        ADMIN: "/admin",
        DONOR: "/donor",
        REQUESTER: "/requester",
      }[user.role]
    : "/login";

  function handleLogout() {
    clearAuthCookie();
    clearAuth();
    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">Blood Aid</span>
          </Link>

          {/* Public Navigation */}
          <nav
            aria-label="Main navigation"
            className="order-3 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm md:order-none md:w-auto md:flex-1"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Authentication Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {!hasHydrated ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted sm:w-32" />
            ) : isAuthenticated && user ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.role}
                  </p>
                </div>

                <Link
                  href={dashboardPath}
                  className="rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted sm:px-4"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
                >
                  Become a Donor
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-4xl text-center">
            {/* Hero Image */}
            <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-2xl border bg-background shadow-sm">
              <Image
                src="/blood-donation.jpg"
                alt="Blood donation to support patients in need"
                width={1200}
                height={600}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="h-auto max-h-[420px] w-full object-cover"
              />
            </div>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <HeartPulse className="h-7 w-7 text-primary" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
              Every donation can save a life
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find blood. Become a donor.{" "}
              <span className="text-primary">Save lives.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Blood Aid connects blood donors with people who urgently need
              blood, making it easier to respond when every minute matters.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {isAuthenticated && user ? (
                <Link
                  href={dashboardPath}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Become a Donor
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    I Need Blood
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How Blood Aid helps
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              One platform for blood emergencies
            </h2>

            <p className="mt-4 text-muted-foreground">
              Simple tools for donors, requesters, and administrators.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <HeartPulse className="h-6 w-6 text-primary" />
          </div>

          <h2 className="mt-4 text-3xl font-bold">
            Ready to help someone in need?
          </h2>

          <p className="mt-4 text-muted-foreground">
            Create your account and become part of the Blood Aid community.
          </p>

          {isAuthenticated && user ? (
            <Link
              href={dashboardPath}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/register"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Blood Aid. All rights reserved.</p>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/services" className="hover:text-primary">
              Services
            </Link>
            <Link href="/faq" className="hover:text-primary">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
