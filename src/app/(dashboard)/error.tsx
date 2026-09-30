"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      {" "}
      <div className="w-full max-w-md rounded-xl border bg-background p-6 text-center shadow-sm">
        {" "}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          {" "}
          <RefreshCcw className="h-6 w-6 text-destructive" />{" "}
        </div>
        <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not load this dashboard section. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </main>
  );
}
