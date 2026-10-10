
// "use client";

// import { useQuery } from "@tanstack/react-query";
// import {
//   CreditCard,
//   HeartPulse,
//   Loader2,
//   Users,
//   Droplets,
//   ShieldCheck,
//   RefreshCw,
//   Activity,
//   TrendingUp,
// } from "lucide-react";

// import { getAdminStats } from "@/src/features/admin/admin.api";

// const formatNumber = (value: number) =>
//   value.toLocaleString("en-BD");

// const formatBDT = (value: number) =>
//   new Intl.NumberFormat("en-BD", {
//     style: "currency",
//     currency: "BDT",
//     maximumFractionDigits: 2,
//   }).format(value);

// const safeCount = (value: unknown): number => {
//   const parsed = Number(value);

//   return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
// };

// export default function AdminDashboard() {
//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//     isFetching,
//   } = useQuery({
//     queryKey: ["admin-stats"],
//     queryFn: getAdminStats,
//   });

//   const stats = data?.data;

//   const totalUsers = safeCount(stats?.users?.total);
//   const totalRequests = safeCount(stats?.bloodRequests?.total);
//   const pendingRequests = safeCount(stats?.bloodRequests?.pending);

//   const totalDonations = safeCount(stats?.donations?.total);
//   const completedDonations = safeCount(stats?.donations?.completed);
//   const verifiedDonations = safeCount(stats?.donations?.verified);

//   const totalPayments = safeCount(stats?.payments?.total);
//   const paidPayments = safeCount(stats?.payments?.paid);
//   const pendingPayments = safeCount(stats?.payments?.pending);
//   const paidAmount = safeCount(stats?.payments?.paidAmount);

//   const verificationRate =
//     totalDonations > 0
//       ? Math.min(
//           100,
//           Math.round((verifiedDonations / totalDonations) * 100),
//         )
//       : 0;

//   const notVerifiedDonations = Math.max(
//     0,
//     totalDonations - verifiedDonations,
//   );

//   const cards = [
//     {
//       label: "Total Users",
//       value: totalUsers,
//       icon: Users,
//       description: "Registered users",
//     },
//     {
//       label: "Blood Requests",
//       value: totalRequests,
//       icon: Droplets,
//       description: "Total requests",
//     },
//     {
//       label: "Donations",
//       value: totalDonations,
//       icon: HeartPulse,
//       description: "Total donations",
//     },
//     {
//       label: "Payments",
//       value: totalPayments,
//       icon: CreditCard,
//       description: "Recorded payments",
//     },
//     {
//       label: "Verified Donations",
//       value: verifiedDonations,
//       icon: ShieldCheck,
//       description: `${verificationRate}% verification rate`,
//     },
//   ];

//   if (isLoading) {
//     return (
//       <section className="space-y-6">
//         <div>
//           <p className="text-sm text-muted-foreground">
//             Administration
//           </p>
//           <h2 className="mt-1 text-2xl font-bold tracking-tight">
//             Overview
//           </h2>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Loading your dashboard statistics...
//           </p>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
//           {cards.map((card) => (
//             <div
//               key={card.label}
//               className="animate-pulse rounded-xl border bg-background p-5"
//             >
//               <div className="h-4 w-28 rounded bg-muted" />
//               <div className="mt-6 h-9 w-20 rounded bg-muted" />
//               <div className="mt-4 h-3 w-32 rounded bg-muted" />
//             </div>
//           ))}
//         </div>

//         <div className="flex min-h-40 items-center justify-center rounded-xl border bg-background">
//           <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//           <span className="ml-2 text-sm text-muted-foreground">
//             Fetching analytics...
//           </span>
//         </div>
//       </section>
//     );
//   }

//   if (isError || !stats) {
//     return (
//       <section className="space-y-6">
//         <div>
//           <p className="text-sm text-muted-foreground">
//             Administration
//           </p>
//           <h2 className="mt-1 text-2xl font-bold tracking-tight">
//             Overview
//           </h2>
//         </div>

//         <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
//           <h3 className="font-semibold text-destructive">
//             Unable to load dashboard statistics
//           </h3>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Check your connection and admin API permissions, then try again.
//           </p>

//           <button
//             type="button"
//             onClick={() => refetch()}
//             disabled={isFetching}
//             className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             <RefreshCw
//               className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
//             />
//             Retry
//           </button>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <p className="text-sm text-muted-foreground">
//             Administration
//           </p>

//           <h2 className="mt-1 text-2xl font-bold tracking-tight">
//             Overview
//           </h2>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Monitor users, blood requests, donations, and payments.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => refetch()}
//           disabled={isFetching}
//           className="inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
//         >
//           <RefreshCw
//             className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
//           />
//           Refresh data
//         </button>
//       </div>

//       {/* Statistics cards */}
//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
//         {cards.map((card) => {
//           const Icon = card.icon;

//           return (
//             <div
//               key={card.label}
//               className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
//             >
//               <div className="flex items-center justify-between gap-3">
//                 <p className="text-sm font-medium text-muted-foreground">
//                   {card.label}
//                 </p>

//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
//                   <Icon className="h-5 w-5 text-primary" />
//                 </div>
//               </div>

//               <p className="mt-4 text-3xl font-bold tracking-tight">
//                 {formatNumber(card.value)}
//               </p>

//               <p className="mt-2 text-xs text-muted-foreground">
//                 {card.description}
//               </p>
//             </div>
//           );
//         })}
//       </div>

//       {/* Analytics */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Platform Overview */}
//         <div className="rounded-xl border bg-background p-5 shadow-sm">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <Activity className="h-5 w-5 text-primary" />
//             </div>

//             <div>
//               <h3 className="font-semibold">
//                 Platform Overview
//               </h3>
//               <p className="text-sm text-muted-foreground">
//                 Current totals across the platform
//               </p>
//             </div>
//           </div>

//           {(() => {
//             const metrics = [
//               {
//                 label: "Users",
//                 value: totalUsers,
//               },
//               {
//                 label: "Blood Requests",
//                 value: totalRequests,
//               },
//               {
//                 label: "Pending Requests",
//                 value: pendingRequests,
//               },
//               {
//                 label: "Donations",
//                 value: totalDonations,
//               },
//               {
//                 label: "Completed Donations",
//                 value: completedDonations,
//               },
//               {
//                 label: "Payments",
//                 value: totalPayments,
//               },
//             ];

//             const maxValue = Math.max(
//               ...metrics.map((item) => item.value),
//               1,
//             );

//             return (
//               <div className="mt-6 space-y-5">
//                 {metrics.map((item) => {
//                   const percentage = Math.round(
//                     (item.value / maxValue) * 100,
//                   );

//                   return (
//                     <div key={item.label}>
//                       <div className="mb-2 flex items-center justify-between gap-3">
//                         <span className="text-sm font-medium">
//                           {item.label}
//                         </span>

//                         <span className="text-sm tabular-nums text-muted-foreground">
//                           {formatNumber(item.value)}
//                         </span>
//                       </div>

//                       <div
//                         className="h-2.5 overflow-hidden rounded-full bg-muted"
//                         role="progressbar"
//                         aria-label={`${item.label} relative total`}
//                         aria-valuemin={0}
//                         aria-valuemax={100}
//                         aria-valuenow={percentage}
//                       >
//                         <div
//                           className="h-full rounded-full bg-primary transition-all duration-500"
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           })()}

//           <p className="mt-5 text-xs text-muted-foreground">
//             Bars compare current totals; they do not represent changes over time.
//           </p>
//         </div>

//         {/* Donation Verification */}
//         <div className="rounded-xl border bg-background p-5 shadow-sm">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <TrendingUp className="h-5 w-5 text-primary" />
//             </div>

//             <div>
//               <h3 className="font-semibold">
//                 Donation Verification
//               </h3>
//               <p className="text-sm text-muted-foreground">
//                 Verification status overview
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 flex flex-col items-center">
//             <div
//               className="relative flex h-40 w-40 items-center justify-center rounded-full"
//               style={{
//                 background: `conic-gradient(var(--primary) ${verificationRate}%, hsl(var(--muted)) ${verificationRate}% 100%)`,
//               }}
//               role="img"
//               aria-label={`${verificationRate}% of all donations verified`}
//             >
//               <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-background">
//                 <span className="text-3xl font-bold">
//                   {verificationRate}%
//                 </span>
//                 <span className="text-xs text-muted-foreground">
//                   Verified
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6 grid w-full grid-cols-2 gap-4">
//               <div className="rounded-lg border p-4">
//                 <p className="text-sm text-muted-foreground">
//                   Verified
//                 </p>
//                 <p className="mt-1 text-2xl font-bold">
//                   {formatNumber(verifiedDonations)}
//                 </p>
//               </div>

//               <div className="rounded-lg border p-4">
//                 <p className="text-sm text-muted-foreground">
//                   Not verified
//                 </p>
//                 <p className="mt-1 text-2xl font-bold">
//                   {formatNumber(notVerifiedDonations)}
//                 </p>
//               </div>
//             </div>

//             <p className="mt-4 text-center text-xs text-muted-foreground">
//               Rate = verified donations ÷ all donations. Not verified includes
//               donations in every other status.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Administration Summary */}
//       <div className="rounded-xl border bg-background p-5 shadow-sm">
//         <div className="flex items-center gap-2">
//           <ShieldCheck className="h-5 w-5 text-primary" />
//           <h3 className="font-semibold">
//             Administration Summary
//           </h3>
//         </div>

//         <p className="mt-2 text-sm leading-6 text-muted-foreground">
//           The dashboard displays the latest statistics returned by the
//           admin API. Use the Users, Blood Requests, Donations, and
//           Payments management pages to review individual records and
//           perform administrative actions.
//         </p>

//         {/* Payment analytics */}
//         <div className="mt-5 grid gap-4 sm:grid-cols-3">
//           <div className="rounded-lg border p-4">
//             <p className="text-sm text-muted-foreground">
//               Paid Payments
//             </p>
//             <p className="mt-1 text-2xl font-bold">
//               {formatNumber(paidPayments)}
//             </p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Successfully paid transactions
//             </p>
//           </div>

//           <div className="rounded-lg border p-4">
//             <p className="text-sm text-muted-foreground">
//               Pending Payments
//             </p>
//             <p className="mt-1 text-2xl font-bold">
//               {formatNumber(pendingPayments)}
//             </p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Awaiting payment completion
//             </p>
//           </div>

//           <div className="rounded-lg border p-4">
//             <p className="text-sm text-muted-foreground">
//               Total Paid Amount
//             </p>
//             <p className="mt-1 break-words text-2xl font-bold">
//               {formatBDT(paidAmount)}
//             </p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Sum of payments marked PAID
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  HeartPulse,
  Users,
  Droplets,
  ShieldCheck,
  RefreshCw,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAdminStats } from "@/src/features/admin/admin.api";

const formatNumber = (value: number) =>
  value.toLocaleString("en-BD");

const formatBDT = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(value);

const safeCount = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const chartColors = [
  "#dc2626",
  "#16a34a",
  "#f59e0b",
  "#64748b",
];

function DashboardSkeleton() {
  return (
    <section
      className="space-y-6"
      aria-label="Loading admin dashboard"
      aria-busy="true"
    >
      <div>
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="rounded-xl border p-5">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-6 h-9 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-3 w-32 max-w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="rounded-xl border p-5">
            <div className="h-5 w-44 animate-pulse rounded bg-muted" />
            <div className="mt-6 h-64 animate-pulse rounded-lg bg-muted/70" />
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardError({
  onRetry,
  isFetching,
}: {
  onRetry: () => void;
  isFetching: boolean;
}) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Administration</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">
          Overview
        </h2>
      </div>

      <div
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-6"
        role="alert"
      >
        <h3 className="font-semibold text-destructive">
          Unable to load dashboard statistics
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Check your connection and admin API permissions, then try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={isFetching}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Retry
        </button>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  const stats = data?.data;

  const totalUsers = safeCount(stats?.users?.total);
  const totalRequests = safeCount(stats?.bloodRequests?.total);
  const pendingRequests = safeCount(stats?.bloodRequests?.pending);

  const totalDonations = safeCount(stats?.donations?.total);
  const completedDonations = safeCount(stats?.donations?.completed);
  const verifiedDonations = safeCount(stats?.donations?.verified);

  const totalPayments = safeCount(stats?.payments?.total);
  const paidPayments = safeCount(stats?.payments?.paid);
  const pendingPayments = safeCount(stats?.payments?.pending);
  const paidAmount = safeCount(stats?.payments?.paidAmount);

  const verificationRate =
    totalDonations > 0
      ? Math.min(
          100,
          Math.round((verifiedDonations / totalDonations) * 100),
        )
      : 0;

  const notVerifiedDonations = Math.max(
    0,
    totalDonations - verifiedDonations,
  );

  const cards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Registered users",
    },
    {
      label: "Blood Requests",
      value: totalRequests,
      icon: Droplets,
      description: "Total requests",
    },
    {
      label: "Donations",
      value: totalDonations,
      icon: HeartPulse,
      description: "Total donations",
    },
    {
      label: "Payments",
      value: totalPayments,
      icon: CreditCard,
      description: "Recorded payments",
    },
    {
      label: "Verified Donations",
      value: verifiedDonations,
      icon: ShieldCheck,
      description: `${verificationRate}% verification rate`,
    },
  ];

  const platformData = [
    { name: "Users", value: totalUsers },
    { name: "Requests", value: totalRequests },
    { name: "Pending Requests", value: pendingRequests },
    { name: "Donations", value: totalDonations },
    { name: "Completed", value: completedDonations },
    { name: "Payments", value: totalPayments },
  ];

  const verificationData = [
    { name: "Verified", value: verifiedDonations },
    { name: "Not verified", value: notVerifiedDonations },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !stats) {
    return (
      <DashboardError
        onRetry={() => void refetch()}
        isFetching={isFetching}
      />
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Administration</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Overview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor users, blood requests, donations, and payments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh data
        </button>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold tracking-tight">
                {formatNumber(card.value)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recharts analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Bar Chart */}
        <div className="min-w-0 rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Platform Overview</h3>
              <p className="text-sm text-muted-foreground">
                Current totals across the platform
              </p>
            </div>
          </div>

          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformData}
                margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#94a3b8"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  angle={-25}
                  textAnchor="end"
                  height={65}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Tooltip
                  formatter={(value) => [
                    formatNumber(Number(value)),
                    "Count",
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Count"
                  fill="#dc2626"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Bars compare current totals; they do not represent changes over time.
          </p>
        </div>

        {/* Verification Donut Chart */}
        <div className="min-w-0 rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Donation Verification</h3>
              <p className="text-sm text-muted-foreground">
                Verification status overview
              </p>
            </div>
          </div>

          {totalDonations === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold">0%</div>
              <p className="mt-2 text-sm text-muted-foreground">
                No donations available yet.
              </p>
            </div>
          ) : (
            <>
              <div className="relative mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verificationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {verificationData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={chartColors[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatNumber(Number(value)),
                        "Donations",
                      ]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {verificationRate}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Verified
                  </span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
                {verificationData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: chartColors[index],
                      }}
                    />
                    <span>{item.name}</span>
                    <span className="font-medium tabular-nums">
                      {formatNumber(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="mt-1 text-2xl font-bold">
                {formatNumber(verifiedDonations)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Not verified</p>
              <p className="mt-1 text-2xl font-bold">
                {formatNumber(notVerifiedDonations)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Rate = verified donations ÷ all donations. Not verified includes
            donations in every other status.
          </p>
        </div>
      </div>

      {/* Administration Summary */}
      <div className="rounded-xl border bg-background p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Administration Summary</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The dashboard displays the latest statistics returned by the
          admin API. Use the Users, Blood Requests, Donations, and
          Payments management pages to review individual records and
          perform administrative actions.
        </p>

        {/* Payment analytics */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Paid Payments</p>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(paidPayments)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Successfully paid transactions
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Pending Payments</p>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(pendingPayments)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Awaiting payment completion
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total Paid Amount</p>
            <p className="mt-1 break-words text-2xl font-bold">
              {formatBDT(paidAmount)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sum of payments marked PAID
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
