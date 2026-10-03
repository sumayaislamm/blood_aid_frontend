import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/types/auth";

export type PaymentProvider = "STRIPE" | "BKASH";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface InitiatePaymentInput {
  bloodRequestId: string;
  provider: PaymentProvider;
}

export interface Payment {
  paymentId: string;
  provider: PaymentProvider;
  amount: string | number;
  currency: string;
  status: PaymentStatus;
  sessionId: string;
  checkoutUrl: string | null;
}

export async function initiatePayment(
  data: InitiatePaymentInput,
): Promise<ApiResponse<Payment>> {
  return apiFetch<ApiResponse<Payment>>("/payments/initiate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface PaymentDetails {
  id: string;
  requesterId: string;
  bloodRequestId: string;
  amount: string | number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;

  bloodRequest: {
    id: string;
    bloodGroup: string;
    units: number;
    amount: string | number;
    hospitalName: string;
    city: string;
    status: string;
  };
}

export async function getPaymentById(
  paymentId: string,
): Promise<ApiResponse<PaymentDetails>> {
  return apiFetch<ApiResponse<PaymentDetails>>(
    `/payments/${paymentId}`,
  );
}
