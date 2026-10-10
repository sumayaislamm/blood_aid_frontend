
import Link from "next/link";
import { Droplets, HeartHandshake, ShieldCheck, Users } from "lucide-react";

export const metadata = {
  title: "About Us | Blood Aid",
  description:
    "Learn how Blood Aid connects blood donors with people who need blood.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Droplets className="h-6 w-6 text-primary" />
            Blood Aid
          </Link>
          <Link href="/" className="text-sm hover:text-primary">
            Home
          </Link>
        </nav>
      </header>

      <section className="bg-muted/30 px-4 py-16 text-center sm:py-24">
        <p className="font-semibold uppercase tracking-wider text-primary">
          About Blood Aid
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">
          Connecting donors. Supporting lives.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
          Blood Aid is a platform designed to connect blood donors with people
          seeking blood and help coordinate blood donation requests.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-3">
        {[
          {
            icon: HeartHandshake,
            title: "Our Mission",
            text: "Help people connect with potential blood donors when they need support.",
          },
          {
            icon: Users,
            title: "Our Community",
            text: "Bring donors and requesters together through one accessible platform.",
          },
          {
            icon: ShieldCheck,
            title: "Our Commitment",
            text: "Support responsible access, account security, and clear communication.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-xl border p-6 shadow-sm">
            <Icon className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>

      <section className="px-4 pb-16 text-center">
        <h2 className="text-2xl font-bold">Be part of the community</h2>
        <Link
          href="/register"
          className="mt-5 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Join Blood Aid
        </Link>
      </section>
    </main>
  );
}
