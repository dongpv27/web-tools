import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "WebTools - Free Online Tools for Developers",
    template: "%s | WebTools",
  },
  description: "Free online tools for developers, designers, and everyone. JSON formatter, Base64 encoder, color picker, and 100+ more tools. 100% client-side for your privacy.",
  keywords: ["online tools", "web tools", "developer tools", "json formatter", "base64 encoder", "free tools"],
  authors: [{ name: "WebTools" }],
  creator: "WebTools",
  metadataBase: new URL("https://webtools.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://webtools.com",
    siteName: "WebTools",
    title: "WebTools - Free Online Tools for Developers",
    description: "Free online tools for developers, designers, and everyone. 100+ tools, 100% client-side.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebTools - Free Online Tools",
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
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
