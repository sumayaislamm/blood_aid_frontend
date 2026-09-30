// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Activity,
//   Bell,
//   ClipboardList,
//   CreditCard,
//   Droplets,
//   FileText,
//   HeartPulse,
//   LayoutDashboard,
//   LogOut,
//   Settings,
//   ShieldCheck,
//   UserRound,
//   Users,
// } from "lucide-react";

// import { useAuthStore } from "@/src/stores/auth.store";
// import { clearAuthCookie } from "@/src/lib/auth-cookie";

// type SidebarItem = {
//   label: string;
//   href: string;
//   icon: React.ElementType;
// };

// const donorItems: SidebarItem[] = [
//   {
//     label: "Dashboard",
//     href: "/donor",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Emergency Requests",
//     href: "/donor/requests",
//     icon: Droplets,
//   },
//   {
//     label: "My Responses",
//     href: "/donor/responses",
//     icon: ClipboardList,
//   },
//   {
//     label: "My Donations",
//     href: "/donor/donations",
//     icon: HeartPulse,
//   },
//   {
//     label: "Profile",
//     href: "/donor/profile",
//     icon: UserRound,
//   },
// ];

// const requesterItems: SidebarItem[] = [
//   {
//     label: "Dashboard",
//     href: "/requester",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "My Blood Requests",
//     href: "/requester/requests",
//     icon: FileText,
//   },
//   {
//     label: "Create Request",
//     href: "/requester/requests/new",
//     icon: Droplets,
//   },
//   {
//     label: "Donor Responses",
//     href: "/requester/responses",
//     icon: ClipboardList,
//   },
//   {
//     label: "Payments",
//     href: "/requester/payments",
//     icon: CreditCard,
//   },
//   {
//     label: "Profile",
//     href: "/requester/profile",
//     icon: UserRound,
//   },
// ];

// const adminItems: SidebarItem[] = [
//   {
//     label: "Dashboard",
//     href: "/admin",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Users",
//     href: "/admin/users",
//     icon: Users,
//   },
//   {
//     label: "Blood Requests",
//     href: "/admin/requests",
//     icon: Droplets,
//   },
//   {
//     label: "Donations",
//     href: "/admin/donations",
//     icon: HeartPulse,
//   },
//   {
//     label: "Payments",
//     href: "/admin/payments",
//     icon: CreditCard,
//   },
//   {
//     label: "Audit Logs",
//     href: "/admin/audit-logs",
//     icon: ShieldCheck,
//   },
// ];

// export default function DashboardSidebar() {
//   const pathname = usePathname();

//   const user = useAuthStore((state) => state.user);
//   const clearAuth = useAuthStore((state) => state.clearAuth);

//   if (!user) {
//     return null;
//   }

//   const items =
//     user.role === "ADMIN"
//       ? adminItems
//       : user.role === "DONOR"
//         ? donorItems
//         : requesterItems;

//   const handleLogout = () => {
//     clearAuth();
//     clearAuthCookie();
//     window.location.href = "/login";
//   };

//   return (
//     <aside className="flex min-h-screen w-64 flex-col border-r bg-background">
//       <div className="border-b p-5">
//         <Link href="/" className="flex items-center gap-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//             <Droplets className="h-5 w-5" />
//           </div>

//           <div>
//             <p className="font-bold">Blood Aid</p>
//             <p className="text-xs text-muted-foreground">
//               Save lives together
//             </p>
//           </div>
//         </Link>
//       </div>

//       <div className="border-b p-4">
//         <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
//           <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
//             <UserRound className="h-4 w-4 text-primary" />
//           </div>

//           <div className="min-w-0">
//             <p className="truncate text-sm font-medium">{user.name}</p>
//             <p className="text-xs capitalize text-muted-foreground">
//               {user.role.toLowerCase()}
//             </p>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 space-y-1 p-4">
//         {items.map((item) => {
//           const Icon = item.icon;

//           const isActive =
//             pathname === item.href ||
//             (item.href !== "/donor" &&
//               item.href !== "/requester" &&
//               item.href !== "/admin" &&
//               pathname.startsWith(`${item.href}/`));

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
//                 isActive
//                   ? "bg-primary text-primary-foreground"
//                   : "text-muted-foreground hover:bg-muted hover:text-foreground"
//               }`}
//             >
//               <Icon className="h-4 w-4" />
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="border-t p-4">
//         <button
//           type="button"
//           onClick={handleLogout}
//           className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
//         >
//           <LogOut className="h-4 w-4" />
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ClipboardList,
  CreditCard,
  Droplets,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useAuthStore } from "@/src/stores/auth.store";
import { clearAuthCookie } from "@/src/lib/auth-cookie";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const donorItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/donor",
    icon: LayoutDashboard,
  },
  {
    label: "Emergency Requests",
    href: "/donor/requests",
    icon: Droplets,
  },
  {
    label: "My Responses",
    href: "/donor/responses",
    icon: ClipboardList,
  },
  {
    label: "My Donations",
    href: "/donor/donations",
    icon: HeartPulse,
  },
  {
    label: "Profile",
    href: "/donor/profile",
    icon: UserRound,
  },
];

const requesterItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/requester",
    icon: LayoutDashboard,
  },
  {
    label: "My Blood Requests",
    href: "/requester/requests",
    icon: FileText,
  },
  {
    label: "Create Request",
    href: "/requester/requests/new",
    icon: Droplets,
  },
  {
    label: "Donor Responses",
    href: "/requester/responses",
    icon: ClipboardList,
  },
  {
    label: "Payments",
    href: "/requester/payments",
    icon: CreditCard,
  },
  {
    label: "Profile",
    href: "/requester/profile",
    icon: UserRound,
  },
];

const adminItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Blood Requests",
    href: "/admin/requests",
    icon: Droplets,
  },
  {
    label: "Donations",
    href: "/admin/donations",
    icon: HeartPulse,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ShieldCheck,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  if (!user) {
    return null;
  }

  const items =
    user.role === "ADMIN"
      ? adminItems
      : user.role === "DONOR"
        ? donorItems
        : requesterItems;

  const handleLogout = () => {
    clearAuth();
    clearAuthCookie();
    window.location.href = "/login";
  };

  const handleNavigation = () => {
    setIsOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="border-b p-5">
        {" "}
        <Link
          href="/"
          onClick={handleNavigation}
          className="flex items-center gap-2"
        >
          {" "}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {" "}
            <Droplets className="h-5 w-5" />{" "}
          </div>
          <div>
            <p className="font-bold">Blood Aid</p>
            <p className="text-xs text-muted-foreground">Save lives together</p>
          </div>
        </Link>
      </div>

      <div className="border-b p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <UserRound className="h-4 w-4 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {user.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/donor" &&
              item.href !== "/requester" &&
              item.href !== "/admin" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavigation}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}{" "}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
        {" "}
        <Link href="/" className="flex items-center gap-2">
          {" "}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {" "}
            <Droplets className="h-4 w-4" />{" "}
          </div>
          <span className="font-bold">Blood Aid</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-64 flex-col border-r bg-background md:flex">
        {sidebarContent}
      </aside>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}
      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background shadow-xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end border-b p-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {sidebarContent}
      </aside>
    </>
  );
}
