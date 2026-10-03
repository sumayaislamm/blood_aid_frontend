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
  return apiFetch<ApiResponse<DonorResponseItem>>(
    "/donor-responses",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}
