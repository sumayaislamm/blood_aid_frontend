
import Link from "next/link";
import { Droplets, Mail, MessageCircle } from "lucide-react";


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Learn about Blood Aid's mission to connect blood donors with people in need.",
  openGraph: {
    title: "Contact Us | Blood Aid",
    description:
      "Discover the mission and purpose behind Blood Aid.",
    images: ["/opengraph-image.png"],
  },
};


export default function ContactPage() {
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
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          We are here to help
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Need assistance with your account or using Blood Aid? Use the
          available support options provided by your project team.
        </p>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-14 sm:grid-cols-2">
        <article className="rounded-xl border p-6">
          <Mail className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Email Support</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Contact the project team using its official support email, if one
            has been configured.
          </p>
        </article>

        <article className="rounded-xl border p-6">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Account Assistance</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            For account-specific issues, sign in and review the features
            available on your dashboard.
          </p>
          <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Go to Login
          </Link>
        </article>
      </section>
    </main>
  );
}
