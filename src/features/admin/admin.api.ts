import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";
import type { AdminDashboardData } from "@/src/types/dashboard";
import type { UserRole, UserStatus } from "@/src/types/auth";

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
  return apiFetch<ApiResponse<AdminDonationsData>>("/admin/donations");
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

export interface AdminAuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details?: unknown;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface AdminAuditLogsData {
  auditLogs: AdminAuditLogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAdminAuditLogs(): Promise<
  ApiResponse<AdminAuditLogsData>
> {
  return apiFetch<ApiResponse<AdminAuditLogsData>>("/admin/audit-logs");
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  avatar?: string | null;
}

export interface AdminUsersData {
  users: AdminUserItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | "ALL";
  status?: UserStatus | "ALL";
}

export async function getAdminUsers(
  params: AdminUsersParams = {},
): Promise<ApiResponse<AdminUsersData>> {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 10));

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.role && params.role !== "ALL") {
    searchParams.set("role", params.role);
  }

  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }

  return apiFetch<ApiResponse<AdminUsersData>>(
    `/admin/users?${searchParams.toString()}`,
  );
}

export async function updateAdminUserStatus(
  userId: string,
  status: UserStatus,
): Promise<ApiResponse<AdminUserItem>> {
  return apiFetch<ApiResponse<AdminUserItem>>(
    `/admin/users/${encodeURIComponent(userId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}
