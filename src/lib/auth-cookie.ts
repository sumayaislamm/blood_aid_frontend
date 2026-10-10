// export function setAuthCookie(token: string) {
//   document.cookie = [
//     `blood-aid-token=${encodeURIComponent(token)}`,
//     "path=/",
//     "max-age=604800",
//     "samesite=lax",
//   ].join("; ");
// }

// export function clearAuthCookie() {
//   document.cookie = [
//     "blood-aid-token=",
//     "path=/",
//     "max-age=0",
//     "samesite=lax",
//   ].join("; ");
// }

import type { UserRole } from "@/src/types/auth";

export function setAuthCookie(token: string, role: UserRole) {
  const cookieOptions = ["path=/", "max-age=604800", "samesite=lax"];

  document.cookie = [
    `blood-aid-token=${encodeURIComponent(token)}`,
    ...cookieOptions,
  ].join("; ");

  document.cookie = [
    `blood-aid-role=${encodeURIComponent(role)}`,
    ...cookieOptions,
  ].join("; ");
}

export function clearAuthCookie() {
  document.cookie = [
    "blood-aid-token=",
    "path=/",
    "max-age=0",
    "samesite=lax",
  ].join("; ");

  document.cookie = [
    "blood-aid-role=",
    "path=/",
    "max-age=0",
    "samesite=lax",
  ].join("; ");
}
