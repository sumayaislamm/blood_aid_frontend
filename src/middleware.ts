// import { NextRequest, NextResponse } from "next/server";

// const roleRoutes = {
//   "/admin": "ADMIN",
//   "/donor": "DONOR",
//   "/requester": "REQUESTER",
// } as const;

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const token = request.cookies.get("blood-aid-token")?.value;

//   const matchedRoute = Object.keys(roleRoutes).find((route) =>
//     pathname.startsWith(route)
//   ) as keyof typeof roleRoutes | undefined;

//   // Public route
//   if (!matchedRoute) {
//     return NextResponse.next();
//   }

//   // Not logged in
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Temporary role check will be added next
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/donor/:path*", "/requester/:path*"],
// };


import { NextRequest, NextResponse } from "next/server";

const roleRoutes = {
  "/admin": "ADMIN",
  "/donor": "DONOR",
  "/requester": "REQUESTER",
} as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("blood-aid-token")?.value;
  const role = request.cookies.get("blood-aid-role")?.value;

  const matchedRoute = Object.keys(roleRoutes).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  ) as keyof typeof roleRoutes | undefined;

  if (!matchedRoute) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = roleRoutes[matchedRoute];

  if (role !== requiredRole) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/donor/:path*", "/requester/:path*"],
};
