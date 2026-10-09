
import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";
import type { AdminDashboardData } from "@/src/types/dashboard";

export interface AdminDonationItem {
  id: string;
  status: "PENDING" | "COMPLETED" | "VERIFIED" | "CANCELLED";
  donationDate: string;
  units: number;
  donor?: {
    id: string;
    name: string;
    email: string;
  };
  bloodRequest?: {
    id: string;
    bloodGroup: string;
    hospitalName: string;
    city: string;
  };
}

// export interface AdminDonationsData {
//   items: AdminDonationItem[];
//   meta?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }


export interface AdminDonationsData {
  donations: AdminDonationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


export async function getAdminStats(): Promise<
  ApiResponse<AdminDashboardData>
> {
  return apiFetch<ApiResponse<AdminDashboardData>>("/admin/stats");
}

export async function getAdminDonations(): Promise<
  ApiResponse<AdminDonationsData>
> {
  return apiFetch<ApiResponse<AdminDonationsData>>(
    "/admin/donations",
  );
}

export async function verifyDonation(
  donationId: string,
): Promise<ApiResponse<AdminDonationItem>> {
  return apiFetch<ApiResponse<AdminDonationItem>>(
    `/admin/donations/${donationId}/verify`,
    {
      method: "PATCH",
    },
  );
}
