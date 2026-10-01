// import { apiFetch } from "@/src/lib/api";
// import type { ApiResponse } from "@/src/types/auth";

// export interface DonorResponseItem {
//   id: string;
//   status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
// }

// export interface DonationItem {
//   id: string;
//   status: "PENDING" | "COMPLETED" | "VERIFIED" | "CANCELLED";
// }

// export async function getMyResponses(): Promise<
//   ApiResponse<DonorResponseItem[]>
// > {
//   return apiFetch<ApiResponse<DonorResponseItem[]>>(
//     "/donor-responses/my-responses",
//   );
// }

// export async function getMyDonations(): Promise<ApiResponse<DonationItem[]>> {
//   return apiFetch<ApiResponse<DonationItem[]>>("/donations/my-donations");
// }


import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";

export interface DonorResponseItem {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
}

export interface DonationItem {
  id: string;
  status: "PENDING" | "COMPLETED" | "VERIFIED" | "CANCELLED";
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}

export async function getMyResponses(): Promise<
  PaginatedResponse<DonorResponseItem>
> {
  return apiFetch<PaginatedResponse<DonorResponseItem>>(
    "/donor-responses/my-responses"
  );
}

export async function getMyDonations(): Promise<
  PaginatedResponse<DonationItem>
> {
  return apiFetch<PaginatedResponse<DonationItem>>(
    "/donations/my-donations"
  );
}
