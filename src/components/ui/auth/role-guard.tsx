// "use client";

// import { useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { useAuthStore } from "@/src/stores/auth.store";

// // import { useAuthStore } from "@/stores/auth.store";

// const routeRoles = {
//   "/admin": "ADMIN",
//   "/donor": "DONOR",
//   "/requester": "REQUESTER",
// } as const;

// export default function RoleGuard({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const user = useAuthStore((state) => state.user);
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

//   const matchedRoute = Object.keys(routeRoles).find((route) =>
//     pathname.startsWith(route)
//   ) as keyof typeof routeRoles | undefined;

//   const requiredRole = matchedRoute ? routeRoles[matchedRoute] : null;

//   const hasAccess =
//     isAuthenticated &&
//     user &&
//     (!requiredRole || user.role === requiredRole);

//   useEffect(() => {
//     if (!isAuthenticated || !user) {
//       router.replace("/login");
//       return;
//     }

//     if (requiredRole && user.role !== requiredRole) {
//       router.replace("/unauthorized");
//     }
//   }, [isAuthenticated, user, requiredRole, router]);

//   if (!isAuthenticated || !user) {
//     return null;
//   }

//   if (requiredRole && user.role !== requiredRole) {
//     return (
//       <main className="flex min-h-screen items-center justify-center">
//         <p className="text-sm text-muted-foreground">
//           Checking access...
//         </p>
//       </main>
//     );
//   }

//   if (!hasAccess) {
//     return null;
//   }

//   return <>{children}</>;
// }

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/src/stores/auth.store";

const routeRoles = {
  "/admin": "ADMIN",
  "/donor": "DONOR",
  "/requester": "REQUESTER",
} as const;

export default function RoleGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const matchedRoute = Object.keys(routeRoles).find((route) =>
    pathname.startsWith(route)
  ) as keyof typeof routeRoles | undefined;

  const requiredRole = matchedRoute ? routeRoles[matchedRoute] : null;

  useEffect(() => {
    // Wait until Zustand restores the persisted state
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/unauthorized");
    }
  }, [
    hasHydrated,
    isAuthenticated,
    user,
    requiredRole,
    router,
  ]);

  // Do not render or redirect before Zustand hydration is complete
  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Checking access...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}