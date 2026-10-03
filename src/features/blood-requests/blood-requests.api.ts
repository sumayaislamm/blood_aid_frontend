import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";
import type { PaginatedResponse } from "../donor/donor.api";

export type BloodRequestStatus =
  | "PENDING"
  | "MATCHED"
  | "FULFILLED"
  | "CANCELLED"
  | "EXPIRED";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type BloodRequestUrgency = "NORMAL" | "URGENT" | "CRITICAL";

export interface BloodRequestItem {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  amount: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  requiredDate: string;
  urgency: BloodRequestUrgency;
  isPriority: boolean;
  description: string | null;
  status: BloodRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateBloodRequestInput = Omit<
  BloodRequestItem,
  "id" | "status" | "createdAt" | "updatedAt" | "description"
> & {
  description?: string;
};

export async function getMyBloodRequests(): Promise<
  ApiResponse<BloodRequestItem[]>
> {
  return apiFetch<ApiResponse<BloodRequestItem[]>>(
    "/blood-requests/my-requests",
  );
}

export async function createBloodRequest(
  data: CreateBloodRequestInput,
): Promise<ApiResponse<BloodRequestItem>> {
  return apiFetch<ApiResponse<BloodRequestItem>>("/blood-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getBloodRequestById(
  id: string,
): Promise<ApiResponse<BloodRequestItem>> {
  return apiFetch<ApiResponse<BloodRequestItem>>(`/blood-requests/${id}`);
}

export async function getBloodRequests(): Promise<
  PaginatedResponse<BloodRequestItem>
> {
  return apiFetch<PaginatedResponse<BloodRequestItem>>(
    "/blood-requests",
  );
}




export async function updateBloodRequest(
  id: string,
  data: Partial<CreateBloodRequestInput>,
): Promise<ApiResponse<BloodRequestItem>> {
  return apiFetch<ApiResponse<BloodRequestItem>>(`/blood-requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteBloodRequest(
  id: string,
): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>(`/blood-requests/${id}`, {
    method: "DELETE",
  });
}

//Donor responses

export type DonorResponseStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED";

export interface DonorResponseItem {
  id: string;
  status: DonorResponseStatus;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  donor?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
  };
}

export async function getBloodRequestResponses(
  requestId: string,
): Promise<PaginatedResponse<DonorResponseItem>> {
  return apiFetch<PaginatedResponse<DonorResponseItem>>(
    `/blood-requests/${requestId}/responses`,
  );
}

export type UpdateDonorResponseStatus = "ACCEPTED" | "REJECTED";

export async function updateDonorResponseStatus(
  responseId: string,
  status: UpdateDonorResponseStatus,
): Promise<ApiResponse<DonorResponseItem>> {
  return apiFetch<ApiResponse<DonorResponseItem>>(
    `/donor-responses/${responseId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}
