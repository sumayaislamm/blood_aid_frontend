
import Link from "next/link";
import { Droplets, Search, HeartHandshake, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Services | Blood Aid",
  description: "Explore blood donation and blood request services from Blood Aid.",
};

const services = [
  {
    icon: Droplets,
    title: "Blood Requests",
    description:
      "Create and manage blood requests when you or someone you care about needs blood.",
  },
  {
    icon: Search,
    title: "Find Donation Opportunities",
    description:
      "Explore available requests and find opportunities to help people in need.",
  },
  {
    icon: HeartHandshake,
    title: "Donor Connections",
    description:
      "Connect donors and requesters through a central platform for blood donation coordination.",
  },
  {
    icon: ShieldCheck,
    title: "Account Management",
    description:
      "Access role-based features for donors, requesters, and administrators.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Droplets className="h-6 w-6 text-primary" /> Blood Aid
          </Link>
          <Link href="/" className="text-sm hover:text-primary">Home</Link>
        </nav>
      </header>

      <section className="bg-muted/30 px-4 py-16 text-center sm:py-20">
        <p className="font-semibold uppercase tracking-wider text-primary">
          Our Services
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Support when it matters
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Tools that help donors and requesters coordinate blood donation needs.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl border p-6 shadow-sm">
            <Icon className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </section>

      <div className="pb-16 text-center">
        <Link href="/register" className="inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          Get Started
        </Link>
      </div>
    </main>
  );
}
