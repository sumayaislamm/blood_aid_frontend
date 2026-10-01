"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyBloodRequests } from "@/src/features/blood-requests/blood-requests.api";

export default function RequesterDashboard() {
  const requestsQuery = useQuery({
    queryKey: ["my-blood-requests"],
    queryFn: getMyBloodRequests,
  });

  console.log("MY BLOOD REQUESTS:", requestsQuery.data);

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Requester Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome, Requester!
        </h1>
      </div>

      <div className="rounded-xl border bg-background p-6">
        <p className="text-sm text-muted-foreground">
          Check the browser console for the blood request API response.
        </p>
      </div>
    </main>
  );
}

