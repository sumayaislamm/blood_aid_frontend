
"use client";

import { useEffect, useState, Suspense } from "react";
import {
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyStripeSession } from "@/src/features/payments/payments.api";

type VerificationState =
  | "loading"
  | "success"
  | "pending"
  | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [state, setState] =
    useState<VerificationState>("loading");

  const [message, setMessage] = useState(
    "Verifying your payment...",
  );

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    async function verifyPayment() {
      try {
        const response = await verifyStripeSession(sessionId!);

        if (cancelled) return;

        if (response.data.status === "PAID") {
          setState("success");
          setMessage(
            "Your payment has been verified successfully.",
          );
        } else {
          setState("pending");
          setMessage(
            "Your payment is being confirmed. Please check your payments page shortly.",
          );
        }
      } catch {
        if (cancelled) return;

        setState("error");
        setMessage(
          "We could not verify your payment right now. Please check your payment history before trying again.",
        );
      }
    }

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border p-8 text-center">
        <XCircle className="mx-auto h-12 w-12 text-amber-600" />

        <h1 className="mt-4 text-xl font-bold">
          Payment Information Missing
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
      {state === "loading" && (
        <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
      )}

      {state === "success" && (
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
      )}

      {(state === "pending" || state === "error") && (
        <XCircle className="mx-auto h-16 w-16 text-amber-600" />
      )}

      <h1 className="mt-5 text-2xl font-bold">
        {state === "loading" && "Verifying Payment"}
        {state === "success" && "Payment Successful"}
        {state === "pending" && "Payment Pending"}
        {state === "error" && "Payment Not Verified"}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {message}
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
