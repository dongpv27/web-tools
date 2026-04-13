import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Toggle this to enable/disable AdSense
const ADSENSE_ENABLED = false;
const ADSENSE_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX";

export const metadata: Metadata = {
  title: {
    default: "Love Web Tools - Free Online Tools for Developers",
    template: "%s | Love Web Tools",
  },
  description: "Free online tools for developers, designers, and everyone. JSON formatter, Base64 encoder, color picker, and 100+ more tools. 100% client-side for your privacy.",
  keywords: ["online tools", "web tools", "developer tools", "json formatter", "base64 encoder", "free tools"],
  authors: [{ name: "Love Web Tools" }],
  creator: "Love Web Tools",
  metadataBase: new URL("https://lovewebtools.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lovewebtools.com",
    siteName: "Love Web Tools",
    title: "Love Web Tools - Free Online Tools for Developers",
    description: "Free online tools for developers, designers, and everyone. 100+ tools, 100% client-side.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Web Tools - Free Online Tools",
    description: "Free online tools for developers, designers, and everyone.",
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
    <html lang="en">
      {/* Google AdSense Script - Only load when enabled */}
      {ADSENSE_ENABLED && (
        <Script
          id="adsense-script"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
        />
      )}
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" toastOptions={{ style: { background: '#16a34a', color: '#fff' } }} />
      </body>
    </html>
  );
}
