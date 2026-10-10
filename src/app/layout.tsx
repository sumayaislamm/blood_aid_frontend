import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";
import Providers from "../providers/providers";

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://blood-aid-frontend.vercel.app/"),
  title: {
    default: "Blood Aid | Blood Donation Platform",
    template: "%s | Blood Aid",
  },
  description:
    "Connect blood donors with people who urgently need blood. Create requests, discover donation opportunities, and help save lives.",
  applicationName: "Blood Aid",
  openGraph: {
    type: "website",
    siteName: "Blood Aid",
    title: "Blood Aid | Blood Donation Platform",
    description:
      "Connect blood donors with people who urgently need blood.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Blood Aid — Blood Donation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blood Aid | Blood Donation Platform",
    description:
      "Connect blood donors with people who urgently need blood.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", nunitoSans.variable, robotoHeading.variable)}>
      <body >
        <Providers>
          {children}
          </Providers>
      </body>
    </html>
  );
}
