export default function PublicLoading() {
  return (
    <main
      aria-label="Loading page"
      aria-busy="true"
      className="min-h-screen"
    >
      {/* Header */}
      <div className="border-b px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="mx-auto h-12 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
        <div className="mx-auto h-4 w-full max-w-xl animate-pulse rounded-md bg-muted" />
        <div className="mx-auto h-4 w-4/5 max-w-lg animate-pulse rounded-md bg-muted" />

        <div className="mx-auto h-12 w-40 animate-pulse rounded-md bg-muted" />

        <div className="grid gap-5 pt-10 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-xl border p-6"
            >
              <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
              <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
