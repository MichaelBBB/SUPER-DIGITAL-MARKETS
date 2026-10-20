import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Super Digital Markets — Top 30 Digital Products, Delivered Instantly",
  description:
    "ChatGPT Plus, Netflix, Adobe, Spotify & 26 more bestsellers at up to 50% off. Instant delivery to USA, India, China & South Africa. Pay by Card, WhatsApp, Google Pay, Alipay or Capitec EFT.",
  openGraph: {
    title: "Super Digital Markets — Top 30 Digital Products",
    description:
      "Up to 50% off Netflix, ChatGPT Plus, Adobe & more. Instant delivery worldwide. Pay your way.",
    url: "https://super-digital-markets-co9n.vercel.app",
    siteName: "Super Digital Markets",
    locale: "en_ZA",
    type: "website",
    images: [{ url: "/assets/images/app_logo.png", width: 512, height: 512, alt: "Super Digital Markets" }],
  },
  twitter: {
    card: "summary",
    title: "Super Digital Markets — Top 30 Digital Products",
    description: "Up to 50% off Netflix, ChatGPT Plus, Adobe & more. Instant delivery.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
