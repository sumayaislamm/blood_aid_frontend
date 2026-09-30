// import DashboardSidebar from "@/src/components/dashboard/sidebar";
// import RoleGuard from "@/src/components/ui/auth/role-guard";
// import DashboardHeader from "./header";

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <RoleGuard>
//       <div className="flex bg-muted/40">
//         <DashboardSidebar />
//         <div className="justify-center">
//           <DashboardHeader />
//           <main className="min-w-0 flex-1">{children}</main>
//         </div>
//       </div>
//     </RoleGuard>
//   );
// }

"use client";

import { useState } from "react";

import DashboardSidebar from "@/src/components/dashboard/sidebar";
import RoleGuard from "@/src/components/ui/auth/role-guard";
import DashboardHeader from "./header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleGuard>
      {" "}
      <div className="flex min-h-screen bg-muted/40">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
