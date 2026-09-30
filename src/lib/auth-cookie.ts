export function setAuthCookie(token: string) {
  document.cookie = [
    `blood-aid-token=${encodeURIComponent(token)}`,
    "path=/",
    "max-age=604800",
    "samesite=lax",
  ].join("; ");
}

export function clearAuthCookie() {
  document.cookie = [
    "blood-aid-token=",
    "path=/",
    "max-age=0",
    "samesite=lax",
  ].join("; ");
}