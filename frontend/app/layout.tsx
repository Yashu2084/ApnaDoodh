import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import LocationProvider from "@/components/LocationProvider";
import LocationModal from "@/components/LocationModal";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import FloatingLocationWidget from "@/components/FloatingLocationWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ApnaDoodh - Premium Farm-Fresh Dairy Marketplace",
  description: "Gurugram's largest direct-to-home dairy marketplace. Browse verified local daily dairies near you, compare raw testing logs, and purchase dairy directly from the source.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.apnadoodh.shop"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased">
        <LocationProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-white text-slate-950">
              <Navbar />
              <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow">
                {children}
              </main>
              <Footer />
              <CartModal />
              
              {/* Global Location Selection Modal */}
              <LocationModal />
              
              {/* Floating Widgets */}
              <FloatingLocationWidget />
              <WhatsAppWidget />
            </div>
          </CartProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
