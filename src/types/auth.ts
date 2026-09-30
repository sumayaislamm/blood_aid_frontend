// export type UserRole = "ADMIN" | "DONOR" | "REQUESTER";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
// }

// export interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
// }


export type UserRole = "ADMIN" | "DONOR" | "REQUESTER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  avatar?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
