
import Link from "next/link";
import { Droplets } from "lucide-react";

export const metadata = {
  title: "FAQ | Blood Aid",
  description: "Frequently asked questions about using Blood Aid.",
};

const faqs = [
  {
    question: "What is Blood Aid?",
    answer:
      "Blood Aid is a platform that helps connect blood donors with people who need blood.",
  },
  {
    question: "How can I register as a donor?",
    answer:
      "Open the registration page, create an account, and follow the available donor registration steps.",
  },
  {
    question: "How can I request blood?",
    answer:
      "Create a requester account, sign in, and use the blood request feature available on your dashboard.",
  },
  {
    question: "Can I manage my requests?",
    answer:
      "Registered users can access the relevant request and account features available for their role.",
  },
  {
    question: "Does Blood Aid guarantee blood availability?",
    answer:
      "No. The platform helps people connect, but donor availability and successful arrangements are not guaranteed. Confirm all arrangements directly.",
  },
  {
    question: "How do I get help?",
    answer:
      "Visit the Contact page for guidance on reaching the project team.",
  },
];

export default function FAQPage() {
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
          Help Center
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Answers to common questions about using Blood Aid.
        </p>
      </section>

      <section className="mx-auto max-w-3xl space-y-4 px-4 py-14">
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-xl border p-5">
            <h2 className="font-semibold">{faq.question}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {faq.answer}
            </p>
          </article>
        ))}

        <div className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Still need help?
          </p>
          <Link href="/contact" className="mt-3 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
