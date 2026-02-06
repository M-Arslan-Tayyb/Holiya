"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/services/store";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner"; // 1. Import Toaster

interface SessionProvidersProps {
  children: ReactNode;
}

export default function SessionProviderWrapper({
  children,
}: SessionProvidersProps) {
  return (
    <Provider store={store}>
      {/* ApiProvider connects RTK Query hooks to the store automatically */}
      <SessionProvider>
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </SessionProvider>
    </Provider>
  );
}
