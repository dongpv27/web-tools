import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_OG_IMAGE, TWITTER_HANDLE } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Toggle this to enable/disable AdSense
const ADSENSE_ENABLED = false;
const ADSENSE_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX";

// Analytics + site-verification IDs. Set the matching env vars in
// production (.env.production / Vercel project settings). All values
// are optional — the corresponding tag is only emitted when present.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
const YANDEX_SITE_VERIFICATION = process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Free Online Tools for Developers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["online tools", "web tools", "developer tools", "json formatter", "base64 encoder", "free tools"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Free Online Tools for Developers`,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: `${SITE_NAME} - Free Online Tools`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  verification: {
    ...(GOOGLE_SITE_VERIFICATION && { google: GOOGLE_SITE_VERIFICATION }),
    ...(YANDEX_SITE_VERIFICATION && { yandex: YANDEX_SITE_VERIFICATION }),
    ...(BING_SITE_VERIFICATION && {
      other: { "msvalidate.01": BING_SITE_VERIFICATION },
    }),
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

      {/* Google Analytics (GA4) — only emitted when NEXT_PUBLIC_GA_ID is set */}
      {GA_ID && (
        <>
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
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
