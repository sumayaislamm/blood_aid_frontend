export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-muted/40 p-6">
      {" "}
      <div className="mx-auto max-w-6xl space-y-6">
        {" "}
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl border bg-background"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border bg-background" />
      </div>
    </main>
  );
}
