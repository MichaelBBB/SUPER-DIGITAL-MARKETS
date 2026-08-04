import "./globals.css";

export const metadata = {
  title: "Super Digital Markets",
  description: "Fast Secure Payments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0f1115]">{children}</body>
    </html>
  );
}
