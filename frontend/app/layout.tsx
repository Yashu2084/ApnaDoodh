import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import LocationProvider from "@/components/LocationProvider";
import LocationModal from "@/components/LocationModal";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import FloatingLocationWidget from "@/components/FloatingLocationWidget";
// import AIDairyAssistant from "@/components/AIDairyAssistant"; // Disabled our custom AI since you are testing Botpress!

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
      <body className="antialiased" suppressHydrationWarning>
        {/* Botpress Integration */}
        <Script src="https://cdn.botpress.cloud/webchat/v5.0/inject.js" strategy="afterInteractive" />
        <Script src="https://files.bpcontent.cloud/2026/09/05/14/20260905142138-1RCOD4Z9.js" strategy="afterInteractive" />
        <LocationProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-white text-slate-950 overflow-x-hidden w-full relative">
              <Navbar />
              <main className="w-full flex-grow flex flex-col">
                {children}
              </main>
              <Footer />
              <CartModal />
              
              {/* Global Location Selection Modal */}
              <LocationModal />
              
              {/* Floating Widgets */}
              <FloatingLocationWidget />
              {/* <AIDairyAssistant /> */}
              <WhatsAppWidget />
            </div>
          </CartProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
