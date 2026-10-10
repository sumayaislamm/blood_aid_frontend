"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <button onClick={reset} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        Try again
      </button>
    </main>
  );
}