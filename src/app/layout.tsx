import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";
import { FavouritesProvider } from "@/hooks/use-favourites";
import { ThemeProvider } from "@/hooks/use-theme";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { ConditionalFooter } from "@/components/layout/conditional-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aluthpola.lk - Sri Lanka's Premier E-commerce Marketplace",
  description:
    "Shop from Amazon, Temu, AliExpress, and local Sri Lankan retailers all in one place. Get the best deals on electronics, fashion, home goods, and wholesale products.",
  keywords:
    "Sri Lanka, e-commerce, online shopping, Amazon, Temu, AliExpress, wholesale, electronics, fashion",
  icons: {
    icon: "/Aluthpola Logo.png",
    apple: "/Aluthpola Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CurrencyProvider>
          <ThemeProvider>
            <FavouritesProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <ConditionalHeader />
                <main className="flex-1">{children}</main>
                <ConditionalFooter />
              </div>
            </CartProvider>
            </FavouritesProvider>
          </ThemeProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
