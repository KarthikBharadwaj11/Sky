import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import CopyTradingNotifications from "@/components/copy-trading/CopyTradingNotifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sky",
  description: "A modern stock trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ConditionalNavbar />
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <CopyTradingNotifications />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
