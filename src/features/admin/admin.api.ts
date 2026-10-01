import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";
import type { AdminDashboardData } from "@/src/types/dashboard";

// export async function getAdminStats(): Promise<
//   ApiResponse<AdminDashboardData>
// > {
//   return apiFetch<ApiResponse<AdminDashboardData>>("/admin/stats");
// }


export async function getAdminStats(): Promise<
  ApiResponse<AdminDashboardData>
> {
  const response = await apiFetch<ApiResponse<AdminDashboardData>>(
    "/admin/stats"
  );

  console.log("ADMIN STATS RESPONSE:", response);

  return response;
}