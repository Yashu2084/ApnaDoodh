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
              <WhatsAppWidget />
            </div>
          </CartProvider>
        </LocationProvider>
        
        {/* Botpress Integration & Interceptor */}
        <Script src="https://cdn.botpress.cloud/webchat/v5.0/inject.js" strategy="beforeInteractive" />
        <Script id="bp-interceptor" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              let originalInit = null;
              
              // Polling to intercept the init function before the auto-script fires
              const bpInterval = setInterval(() => {
                if (window.botpress && window.botpress.init && window.botpress.init !== interceptInit) {
                  originalInit = window.botpress.init;
                  
                  function interceptInit(config) {
                    try {
                      // Dynamically replace the bot avatar and launcher (FAB) image with the custom ApnaDoodh mascot
                      const mascotUrl = window.location.origin + '/assets/ai-mascot.png';
                      
                      if (config && config.configuration) {
                        config.configuration.fabImage = mascotUrl;
                        config.configuration.botAvatar = mascotUrl;
                        
                        // We inject custom theme properties to override default Botpress styling
                        config.configuration.theme = {
                          ...(config.configuration.theme || {}),
                          style: {
                            ...(config.configuration.theme?.style || {}),
                            floatingActionButton: {
                              backgroundColor: "#ffffff",
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                              width: "48px",
                              height: "48px"
                            }
                          }
                        };
                      }
                    } catch(e) { console.error("Failed to intercept Botpress config", e); }
                    
                    // Call the original init with our modified config
                    originalInit.call(window.botpress, config);
                  }
                  
                  window.botpress.init = interceptInit;
                  clearInterval(bpInterval);
                }
              }, 10);
              
              // Failsafe clear
              setTimeout(() => clearInterval(bpInterval), 5000);
            }
          `}
        </Script>
        <Script src="https://files.bpcontent.cloud/2026/09/05/14/20260905142138-1RCOD4Z9.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
