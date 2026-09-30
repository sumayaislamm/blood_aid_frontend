// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "https://blood-aid-flax.vercel.app/api/v1";

// export async function apiFetch<T>(
//   endpoint: string,
//   options?: RequestInit
// ): Promise<T> {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...options?.headers,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Something went wrong");
//   }

//   return data;
// }

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ;

interface ApiErrorResponse {
  message?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("blood-aid-auth")
      : null;

  let authToken: string | null = null;

  if (token) {
    try {
      const parsed = JSON.parse(token) as {
        state?: {
          token?: string | null;
        };
      };

      authToken = parsed.state?.token ?? null;
    } catch {
      authToken = null;
    }
  }

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: T | ApiErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    throw new Error(errorData.message || "Something went wrong");
  }

  return data as T;
}
