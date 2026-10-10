# Blood Aid 🩸

**Blood Donation & Emergency Platform** is a role-based web application where requesters post emergency blood requests, donors respond and record their donations, and admins manage users, requests, donations, payments and audit logs.

## Live Links

| | Link |
|---|---|
| **Live Frontend** | https://blood-aid-frontend.vercel.app/ |
| **Live Backend** | https://blood-aid-flax.vercel.app/ |
| **Frontend Repo** | https://github.com/sumayaislamm/blood_aid_frontend |
| **Backend Repo** | https://github.com/sumayaislamm/blood_aid.git |
| **API Documentation** | https://documenter.getpostman.com/view/55052094/2sBYAxPUrL |
| **Demo Video** | https://drive.google.com/drive/folders/1yOSSnYRoIbKXSA9KkF5JByRAE7zG4GhZ?usp=sharing |

## Demo Credentials

The login page has one-click **Demo Login** buttons for each role. You can also sign in manually:

|---|---|---|
| Admin | `admin@bloodaid.com` | `Admin56%%` |
| Requester | `requester@bloodaid.com` | `Requester56%%` |
| Donor | `donor@bloodaid.com` | `Donor56%%` |

**Stripe test card:** `4242 4242 4242 4242`, any future expiry date, any CVC.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling / UI | Tailwind CSS 4, shadcn/ui, Lucide React |
| Server state | TanStack Query |
| Client state | Zustand (persisted auth store) |
| Forms / Validation | React Hook Form + Zod |
| Notifications | Sonner |
| Payments | Stripe Checkout (test mode) |
| Auth | Custom JWT + Next.js Middleware |
| Deployment | Vercel |

## Features

### Authentication & Access Control
- Register and login with JWT
- One-click demo login for Admin, Donor and Requester
- Route protection with Next.js middleware
- Role-based sidebar and pages (Admin, Donor, Requester)
- Unauthorized page for role mismatch
- Logged-in users are redirected away from login and register

### Requester
- Dashboard with request statistics and recent requests
- Multi-step wizard to create a blood request
- View, edit and delete own blood requests
- View donor responses and accept or reject them
- Pay for requests with Stripe, with success and cancel pages
- Profile management

### Donor
- Dashboard with response and donation statistics
- Create and manage donor profile
- Browse emergency blood requests and respond with a message
- Track own responses
- Record donations and mark them as completed

### Admin
- Overview dashboard with platform statistics
- **Users:** search, filter by role and status, block / unblock
- **Blood Requests:** search, filter, sort, update status
- **Donations:** filter, verify donations
- **Payments:** search, filter by provider and status, sort
- **Audit Logs:** search and filter system activity
- Server-side pagination on management tables

## Getting Started

### Prerequisites
- Node.js 20 or later
- A running backend API (see the backend repo above)

### Installation

```bash
git clone https://github.com/sumayaislamm/blood_aid_frontend.git
cd blood_aid_frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://blood-aid-flax.vercel.app/api/v1
```

> Use `http://localhost:5000/api/v1` instead when running the backend locally. Adjust the path to match your backend's API prefix.

### Run

```bash
npm run dev      # start development server
npm run build    # create production build
npm run start    # run production build
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (public)/          # login, register, unauthorized
│   ├── (dashboard)/       # admin, donor and requester dashboards
│   ├── layout.tsx
│   └── page.tsx           # landing page
├── components/            # sidebar, role guard, UI components
├── features/              # API functions per domain
├── lib/                   # API client, auth cookie, utils
├── providers/             # React Query and toast providers
├── stores/                # Zustand auth store
├── types/                 # shared TypeScript types
├── validations/           # Zod schemas
└── middleware.ts          # route protection
```

## Payment Flow

1. A requester clicks **Pay with Stripe** on a blood request.
2. The frontend calls `POST /payments/initiate` and redirects to Stripe Checkout.
3. Stripe redirects back to `/requester/payments/success` or `/requester/payments/cancel`.

## Author

**Sumaya Islam**
GitHub: [@sumayaislamm](https://github.com/sumayaislamm)