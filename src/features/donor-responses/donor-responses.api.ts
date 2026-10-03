import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";

export type DonorResponseStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED";

export interface DonorResponseItem {
  id: string;
  bloodRequestId: string;
  donorId: string;
  status: DonorResponseStatus;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  respondedAt: string | null;
}

export interface CreateDonorResponseInput {
  bloodRequestId: string;
  message?: string;
}

export async function createDonorResponse(
  data: CreateDonorResponseInput,
): Promise<ApiResponse<DonorResponseItem>> {
  return apiFetch<ApiResponse<DonorResponseItem>>("/donor-responses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export interface MyDonorResponseItem extends DonorResponseItem {
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

export interface DonorResponsesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyDonorResponsesResponse {
  success: boolean;
  message: string;
  data: MyDonorResponseItem[];
  pagination: DonorResponsesPagination;
}

export async function getMyDonorResponses(): Promise<MyDonorResponsesResponse> {
  return apiFetch<MyDonorResponsesResponse>(
    "/donor-responses/my-responses",
  );
}
