import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://super-digital-markets-co9n.vercel.app"),
  title: {
    default: "Super Digital Markets | Premium AI & Creative Tools",
    template: "%s | Super Digital Markets",
  },
  description: "Instant delivery of premium digital products. AI tools, creative software, and productivity suites. Secure checkout via Peach Payments.",
  keywords: ["AI tools", "digital products", "software licenses", "instant delivery", "premium apps"],
  authors: [{ name: "Super Digital Markets", url: "https://super-digital-markets-co9n.vercel.app" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://super-digital-markets-co9n.vercel.app",
    siteName: "Super Digital Markets",
    title: "Super Digital Markets | Premium AI & Creative Tools",
    description: "Instant delivery of premium digital products. Secure checkout & 24/7 support.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Super Digital Markets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Super Digital Markets",
    description: "Premium digital products with instant automated delivery.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console, Bing, etc. here if needed
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-950 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
