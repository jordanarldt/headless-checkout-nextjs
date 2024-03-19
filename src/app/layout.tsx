import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Introduction } from "../components/Introduction";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BigCommerce Headless Checkout Example",
  description: "Simple app to make a BigCommerce embedded checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center p-12">
          <Introduction />
          {children}
        </main>
      </body>
    </html>
  );
}
