import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";
import type { AdminDashboardData } from "@/src/types/dashboard";
import type { UserRole, UserStatus } from "@/src/types/auth";
import type {
  BloodRequestStatus,
  BloodGroup,
  BloodRequestUrgency,
  BloodRequestItem,
} from "@/src/features/blood-requests/blood-requests.api";

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

export interface AdminDonationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminDonationItem["status"] | "ALL";
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "donationDate"
    | "units"
    | "status";
  sortOrder?: "asc" | "desc";
}

export async function getAdminStats(): Promise<
  ApiResponse<AdminDashboardData>
> {
  return apiFetch<ApiResponse<AdminDashboardData>>("/admin/stats");
}

// export async function getAdminDonations(): Promise<
//   ApiResponse<AdminDonationsData>
// > {
//   return apiFetch<ApiResponse<AdminDonationsData>>("/admin/donations");
// }

export async function getAdminDonations(
  params: AdminDonationsParams = {},
): Promise<ApiResponse<AdminDonationsData>> {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 10));
  searchParams.set("sortBy", params.sortBy ?? "createdAt");
  searchParams.set("sortOrder", params.sortOrder ?? "desc");

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }

  return apiFetch<ApiResponse<AdminDonationsData>>(
    `/admin/donations?${searchParams.toString()}`,
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


export interface AdminAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entity?: string;
  userId?: string;
  sortOrder?: "asc" | "desc";
}

export async function getAdminAuditLogs(
  params: AdminAuditLogsParams = {},
): Promise<ApiResponse<AdminAuditLogsData>> {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 10));
  searchParams.set("sortOrder", params.sortOrder ?? "desc");

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.action) {
    searchParams.set("action", params.action);
  }

  if (params.entity) {
    searchParams.set("entity", params.entity);
  }

  if (params.userId) {
    searchParams.set("userId", params.userId);
  }

  return apiFetch<ApiResponse<AdminAuditLogsData>>(
    `/admin/audit-logs?${searchParams.toString()}`,
  );
}

// export async function getAdminAuditLogs(): Promise<
//   ApiResponse<AdminAuditLogsData>
// > {
//   return apiFetch<ApiResponse<AdminAuditLogsData>>("/admin/audit-logs");
// }

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

export interface AdminBloodRequestItem extends BloodRequestItem {
  requester: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  _count: {
    responses: number;
    donations: number;
    payments: number;
  };
}

export interface AdminBloodRequestsData {
  bloodRequests: AdminBloodRequestItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminBloodRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  bloodGroup?: BloodGroup | "ALL";
  urgency?: BloodRequestUrgency | "ALL";
  status?: BloodRequestStatus | "ALL";
  city?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getAdminBloodRequests(
  params: AdminBloodRequestsParams = {},
): Promise<ApiResponse<AdminBloodRequestsData>> {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 10));
  searchParams.set("sortBy", params.sortBy ?? "createdAt");
  searchParams.set("sortOrder", params.sortOrder ?? "desc");

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.bloodGroup && params.bloodGroup !== "ALL") {
    searchParams.set("bloodGroup", params.bloodGroup);
  }

  if (params.urgency && params.urgency !== "ALL") {
    searchParams.set("urgency", params.urgency);
  }

  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }

  if (params.city?.trim()) {
    searchParams.set("city", params.city.trim());
  }

  return apiFetch<ApiResponse<AdminBloodRequestsData>>(
    `/admin/blood-requests?${searchParams.toString()}`,
  );
}

export async function updateAdminBloodRequestStatus(
  requestId: string,
  status: BloodRequestStatus,
): Promise<ApiResponse<AdminBloodRequestItem>> {
  return apiFetch<ApiResponse<AdminBloodRequestItem>>(
    `/admin/blood-requests/${encodeURIComponent(requestId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}


// Payment


export type AdminPaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type AdminPaymentProvider = "STRIPE" | "BKASH";

export interface AdminPaymentItem {
  id: string;
  amount: string | number;
  currency: string;
  provider: AdminPaymentProvider;
  status: AdminPaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  requester?: {
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

export interface AdminPaymentsData {
  payments: AdminPaymentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  provider?: AdminPaymentProvider;
  status?: AdminPaymentStatus;
  sortBy?: "createdAt" | "updatedAt" | "paidAt" | "amount" | "status" | "provider";
  sortOrder?: "asc" | "desc";
}

export async function getAdminPayments(
  params: AdminPaymentsParams = {},
): Promise<ApiResponse<AdminPaymentsData>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return apiFetch<ApiResponse<AdminPaymentsData>>(
    `/admin/payments${query ? `?${query}` : ""}`,
  );
}
