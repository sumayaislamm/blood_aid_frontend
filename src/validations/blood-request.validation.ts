import { z } from "zod";

export const bloodRequestSchema = z.object({
  bloodGroup: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ]),

  units: z
    .number()
    .int("Units must be a whole number")
    .min(1, "At least 1 unit is required")
    .max(10, "Maximum 10 units allowed"),

  amount: z
    .number()
    .min(0, "Amount cannot be negative"),

  hospitalName: z
    .string()
    .min(2, "Hospital name is required")
    .max(255, "Hospital name is too long"),

  hospitalAddress: z
    .string()
    .min(5, "Hospital address is required")
    .max(500, "Hospital address is too long"),

  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City name is too long"),

  requiredDate: z
    .string()
    .min(1, "Required date is required"),

  urgency: z.enum(["NORMAL", "URGENT", "CRITICAL"]),

  isPriority: z.boolean(),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
});

export type BloodRequestFormValues = z.infer<
  typeof bloodRequestSchema
>;
