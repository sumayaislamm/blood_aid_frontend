// import { create } from "zustand";
// import { User } from "../types/auth";

// interface AuthStore {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   setAuth: (user: User, token: string) => void;
//   clearAuth: () => void;
// }

// export const useAuthStore = create<AuthStore>((set) => ({
//   user: null,
//   token: null,
//   isAuthenticated: false,

//   setAuth: (user, token) =>
//     set({
//       user,
//       token,
//       isAuthenticated: true,
//     }),

//   clearAuth: () =>
//     set({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//     }),
// }));

// import { create } from "zustand";
// import { persist } from "zustand/middleware"
// import { User } from "../types/auth";
// interface AuthStore {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   setAuth: (user: User, token: string) => void;
//   clearAuth: () => void;
// }
// export const useAuthStore = create<AuthStore>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
//       clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
//     }),
//     { name: "blood-aid-auth" },
//   ),
// );


import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/src/types/auth";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "blood-aid-auth",

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);