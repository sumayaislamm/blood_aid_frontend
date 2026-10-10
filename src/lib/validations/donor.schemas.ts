
import { z } from "zod";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

const optionalText = z.string().trim().max(1000, "Maximum 1000 characters allowed.");

export const donorProfileSchema = z.object({
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
  dateOfBirth: requiredText("Date of birth"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  city: requiredText("City"),
  area: requiredText("Area"),
  lastDonationDate: z.string().optional().or(z.literal("")),
});

export const donorResponseSchema = z.object({
  message: z.string().trim().max(1000, "Maximum 1000 characters allowed."),
});

export const donationSchema = z.object({
  donationDate: requiredText("Donation date"),
  units: z
    .number({ error: "Enter the number of units." })
    .int("Units must be a whole number.")
    .min(1, "At least 1 unit is required.")
    .max(10, "Maximum 10 units allowed."),
  notes: optionalText.optional().or(z.literal("")),
});

export type DonorProfileFormValues = z.infer<typeof donorProfileSchema>;
export type DonorResponseFormValues = z.infer<typeof donorResponseSchema>;
export type DonationFormValues = z.infer<typeof donationSchema>;
