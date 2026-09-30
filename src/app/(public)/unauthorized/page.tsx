export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Access Denied</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </div>
    </main>
  );
}