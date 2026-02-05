"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/services/store";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface SessionProvidersProps {
  children: ReactNode;
}

export default function SessionProviderWrapper({
  children,
}: SessionProvidersProps) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SessionProvider>
    </Provider>
  );
}
