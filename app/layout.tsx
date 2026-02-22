// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import SessionProviderWrapper from "./providers/sessionProviderWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Holiya",
  description: "Health Journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${montserrat.variable} antialiased min-h-full`}>
        <Suspense fallback={null}>
          <SessionProviderWrapper><TooltipProvider>{children}</TooltipProvider></SessionProviderWrapper>
        </Suspense>
      </body>
    </html>
  );
}
