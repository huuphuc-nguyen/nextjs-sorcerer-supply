import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "@/context/Provider";
import HeaderWrapper from "@/components/SiteHeader/site-header-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorcerer's Supply",
  description: "Wizard focused ecommerce site",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sorcerer's Supply",
    description: "Wizard focused ecommerce site",
    url: "https://sorcerersupply.store",
    siteName: "Sorcerer's Supply Store",
    images: [
      {
        url: "/banner_3.png",
        width: 1200,
        height: 630,
        alt: "Sorcerer's Supply - Magical Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
        <main>
          <NextTopLoader height={4} color="#FF0000" />
          <Provider>
            <HeaderWrapper>
            {children}
            </HeaderWrapper>
          </Provider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
