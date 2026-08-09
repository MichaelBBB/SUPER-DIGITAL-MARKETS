import "./globals.css";

export const metadata = {
  title: "Super Digital Markets",
  description: "From AI tools to creative software — shop globally.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0f1115] text-white">{children}</body>
    </html>
  );
}
