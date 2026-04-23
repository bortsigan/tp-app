import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./lib/cart";
import { Header } from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Press PH — Custom Tee-Shirt Printing",
  description:
    "Shop ready-made tees or customize your own. Pick a color, design, placement, and Filipino size. Add to cart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
        <CartProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <footer className="border-t border-black/10 py-8 text-center text-xs text-zinc-500 dark:border-white/10">
            © {new Date().getFullYear()} The Press PH — Print-on-demand. Payment integration coming soon.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
