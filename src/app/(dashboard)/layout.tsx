import RoleGuard from "@/src/components/ui/auth/role-guard";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RoleGuard>{children}</RoleGuard>;
}