import DashboardSidebar from "@/src/components/dashboard/sidebar";
import RoleGuard from "@/src/components/ui/auth/role-guard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard>
      <div className="flex min-h-screen bg-muted/40">
        <DashboardSidebar/>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </RoleGuard>
  );
}
