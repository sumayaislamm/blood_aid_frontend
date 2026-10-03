"use client";

import { CreditCard, XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-background p-8 text-center shadow-sm">
      <XCircle className="mx-auto h-16 w-16 text-destructive" />

      <h1 className="mt-5 text-2xl font-bold">
        Payment Cancelled
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Your payment was cancelled or you left the Stripe checkout
        page before completing the payment.
      </p>

      <div className="mt-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        No successful payment was recorded from this checkout.
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/requester/payments"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <CreditCard className="h-4 w-4" />
          Back to Payments
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
