import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TopNav } from "./_componets/topnav";


export const metadata: Metadata = {
  title: "MotoRide - Premium Motorcycles",
  description: "Find your perfect motorcycle with flexible financing and expert support",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <TopNav />
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}