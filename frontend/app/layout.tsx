import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Payment Merchant",
  description: "Payment merchant client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
          <div className="flex flex-1 flex-row items-center align-middle space-x-4">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/history" className="hover:underline">
              History
            </a>
            <a href="/top-up" className="hover:underline">
              Top Up
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
