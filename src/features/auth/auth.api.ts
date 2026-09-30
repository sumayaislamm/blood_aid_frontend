import { apiFetch } from "@/src/lib/api";
import { ApiResponse, LoginInput, LoginResponse, User } from "@/src/types/auth";


export async function loginUser(
  data: LoginInput
): Promise<ApiResponse<LoginResponse>> {
  return apiFetch<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiFetch<ApiResponse<User>>("/auth/me");
}

export async function updateCurrentUser(
  data: Partial<Pick<User, "name" | "phone">>
): Promise<ApiResponse<User>> {
  return apiFetch<ApiResponse<User>>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}