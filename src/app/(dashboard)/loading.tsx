// export default function DashboardLoading() {
//   return (
//     <main className="min-h-screen bg-muted/40 p-6">
//       {" "}
//       <div className="mx-auto max-w-6xl space-y-6">
//         {" "}
//         <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {Array.from({ length: 4 }).map((_, index) => (
//             <div
//               key={index}
//               className="h-32 animate-pulse rounded-xl border bg-background"
//             />
//           ))}
//         </div>
//         <div className="h-64 animate-pulse rounded-xl border bg-background" />
//       </div>
//     </main>
//   );
// }


export default function DashboardLoading() {
  return (
    <main
      aria-label="Loading dashboard"
      aria-busy="true"
      className="min-h-[60vh] space-y-6"
    >
      {/* Page heading */}
      <div className="space-y-2">
        <div className="h-7 w-52 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border bg-background p-5"
          >
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-36 max-w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="space-y-5 rounded-xl border bg-background p-5"
          >
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-64 animate-pulse rounded-lg bg-muted/70" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-4 rounded-xl border bg-background p-5">
        <div className="h-5 w-36 animate-pulse rounded bg-muted" />

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-md bg-muted/70"
          />
        ))}
      </div>
    </main>
  );
}
