import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";

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

// export type CreateBloodRequestInput = Omit<
//   BloodRequestItem,
//   "id" | "status" | "createdAt" | "updatedAt"
// >;

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

// export async function createBloodRequest(
//   data: Omit<BloodRequestItem, "id" | "status" | "createdAt" | "updatedAt">,
// ): Promise<ApiResponse<BloodRequestItem>> {
//   return apiFetch<ApiResponse<BloodRequestItem>>("/blood-requests", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }
export async function createBloodRequest(
  data: CreateBloodRequestInput,
): Promise<ApiResponse<BloodRequestItem>> {
  return apiFetch<ApiResponse<BloodRequestItem>>("/blood-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
