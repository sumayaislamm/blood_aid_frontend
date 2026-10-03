import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";

export interface DonorProfile {
  id: string;
  userId: string;
  bloodGroup: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  lastDonationDate?: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// export interface CreateDonorProfileInput {
//   bloodGroup: string;
//   dateOfBirth?: string;
//   gender?: string;
//   address?: string;
//   city?: string;
//   lastDonationDate?: string;
//   isAvailable: boolean;
// }


export interface CreateDonorProfileInput {
  bloodGroup:
    | "A_POSITIVE"
    | "A_NEGATIVE"
    | "B_POSITIVE"
    | "B_NEGATIVE"
    | "AB_POSITIVE"
    | "AB_NEGATIVE"
    | "O_POSITIVE"
    | "O_NEGATIVE";
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  city: string;
  area: string;
  lastDonationDate?: string;
}

export async function getMyDonorProfile(): Promise<
  ApiResponse<DonorProfile>
> {
  return apiFetch<ApiResponse<DonorProfile>>(
    "/donor-profile/me",
  );
}

export async function createDonorProfile(
  data: CreateDonorProfileInput,
): Promise<ApiResponse<DonorProfile>> {
  return apiFetch<ApiResponse<DonorProfile>>(
    "/donor-profile",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function updateDonorProfile(
  data: Partial<CreateDonorProfileInput>,
): Promise<ApiResponse<DonorProfile>> {
  return apiFetch<ApiResponse<DonorProfile>>(
    "/donor-profile/me",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}
