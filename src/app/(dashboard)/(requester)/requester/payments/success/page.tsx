"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border p-8 text-center">
        <h1 className="text-xl font-bold">
          Payment information missing
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          We could not find the Stripe checkout session.
        </p>

        <Link
          href="/requester/payments"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to Payments
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-background p-8 text-center shadow-sm">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />

      <h1 className="mt-5 text-2xl font-bold">
        Payment Successful
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Your Stripe payment was completed successfully.
      </p>

      <div className="mt-6 rounded-lg bg-muted p-4 text-left">
        <p className="text-xs text-muted-foreground">
          Stripe Session ID
        </p>

        <p className="mt-1 break-all text-sm font-medium">
          {sessionId}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/requester/payments"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          View Payments
        </Link>

        <Link
          href="/requester"
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
