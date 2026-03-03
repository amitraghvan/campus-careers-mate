/**
 * AppProviders — wraps the entire app with all necessary providers.
 * Keeps App.tsx clean and makes provider ordering explicit.
 */

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

function MissingKeyError() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#e2e8f0",
    }}>
      <div style={{
        textAlign: "center",
        padding: "2rem",
        maxWidth: "480px",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "1rem",
        background: "rgba(239,68,68,0.05)",
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f87171", marginBottom: "0.5rem" }}>
          Missing Configuration
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
          The <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable is not set.
        </p>
        <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "1rem" }}>
          Add it in your Vercel → Settings → Environment Variables and redeploy.
        </p>
      </div>
    </div>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  if (!PUBLISHABLE_KEY) {
    return <MissingKeyError />;
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "hsl(172, 66%, 50%)",
          colorBackground: "transparent",
          colorInputBackground: "transparent",
          colorInputText: "hsl(210, 40%, 96%)",
          colorText: "hsl(210, 40%, 96%)",
          colorTextSecondary: "hsl(220, 10%, 55%)",
          fontFamily: "'Inter', 'Space Grotesk', system-ui, sans-serif",
          borderRadius: "0.75rem",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

