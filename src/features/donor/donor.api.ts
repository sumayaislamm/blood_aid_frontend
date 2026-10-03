import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";

export interface DonorResponseItem {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
}

export interface DonationItem {
  id: string;
  bloodRequestId: string;
  responseId: string;
  donationDate: string;
  units: number;
  status: "PENDING" | "COMPLETED" | "VERIFIED" | "CANCELLED";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  bloodRequest?: {
    id: string;
    bloodGroup: string;
    units: number;
    hospitalName: string;
    hospitalAddress: string;
    city: string;
    requiredDate: string;
    urgency: string;
    status: string;
  };
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
    "/donor-responses/my-responses",
  );
}

export async function getMyDonations(): Promise<
  PaginatedResponse<DonationItem>
> {
  return apiFetch<PaginatedResponse<DonationItem>>("/donations/my-donations");
}

export async function updateDonationStatus(
  id: string,
  status: "COMPLETED",
): Promise<ApiResponse<DonationItem>> {
  return apiFetch<ApiResponse<DonationItem>>(`/donations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
}

export interface CreateDonationInput {
  donationDate: string;
  units: number;
  notes?: string;
}

export async function createDonation(
  responseId: string,
  data: CreateDonationInput,
): Promise<ApiResponse<DonationItem>> {
  return apiFetch<ApiResponse<DonationItem>>(
    `/donations/response/${responseId}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}
