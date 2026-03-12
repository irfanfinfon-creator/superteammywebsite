import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/app-shell";
import { getPublishedAnnouncements } from "@/lib/supabase/data";

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superteam Malaysia",
  description: "The community of Solana builders in Malaysia. Connect, learn, and grow together with the local talents.",
  keywords: ["Superteam", "Malaysia", "Solana", "Web3", "Blockchain", "Crypto"],
  openGraph: {
    title: "Superteam Malaysia",
    description: "The community of Solana builders in Malaysia. Connect, learn, and grow together with the local talents.",
    type: "website",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcements = await getPublishedAnnouncements()

  return (
    <html lang="en">
      <body
        className={`${geologica.variable} antialiased`}
      >
        <Providers>
          <AppShell announcements={announcements}>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
