/**
 * AuthPage — Sign In / Sign Up page with toggle.
 * Beautiful glassmorphic card with animated background using Clerk components.
 */

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import { APP_CONFIG } from "@/config";
import type { AuthMode } from "@/features/auth/types";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const { isLoaded, isSignedIn } = useAuth();

  // If already logged in, redirect to dashboard
  if (isLoaded && isSignedIn) {
    return <Navigate to={APP_CONFIG.routes.dashboard} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />
      <div className="fixed inset-0 bg-radial-accent pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-info/5 rounded-full blur-[150px] animate-float" />

      {/* Auth Container wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] flex flex-col items-center"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary mb-4 p-2">
            <GraduationCap className="h-full w-full text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight">
            {APP_CONFIG.name}
          </h1>
        </div>

        <div className="w-full glass-card rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-lg relative glow-primary">
          {/* Mode Tabs */}
          <div className="flex w-full mb-6 rounded-xl bg-black/20 p-1 border border-white/5 shadow-inner">
            <button
              onClick={() => setMode("sign-in")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === "sign-in"
                ? "bg-white/10 text-foreground shadow-sm ring-1 ring-white/10"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("sign-up")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === "sign-up"
                ? "bg-white/10 text-foreground shadow-sm ring-1 ring-white/10"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Clerk Component Wrapper */}
          <div className="w-full flex justify-center min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {mode === "sign-in" ? (
                  <SignIn
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        cardBox: "shadow-none rounded-none w-full",
                        card: "w-full !bg-transparent shadow-none border-0 p-0 m-0",
                        header: "hidden",
                        socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all rounded-xl shadow-sm h-11",
                        socialButtonsBlockButtonText: "font-semibold text-sm",
                        dividerRow: "my-5",
                        dividerLine: "bg-white/10",
                        dividerText: "text-muted-foreground font-medium text-xs uppercase tracking-wider",
                        formFieldRow: "mb-4 space-y-1.5",
                        formFieldLabel: "text-muted-foreground text-xs font-medium",
                        formFieldInput: "bg-black/20 border border-white/10 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary rounded-xl h-11 shadow-inner transition-all",
                        formButtonPrimary: "bg-gradient-to-r from-primary to-info hover:opacity-90 shadow-md transition-opacity text-primary-foreground font-bold py-3 rounded-xl mt-4 w-full",
                        footer: "hidden",
                        identityPreviewText: "text-foreground font-medium",
                        identityPreviewEditButtonIcon: "text-primary hover:text-primary/80",
                        formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
                      },
                    }}
                  />
                ) : (
                  <SignUp
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        cardBox: "shadow-none rounded-none w-full",
                        card: "w-full !bg-transparent shadow-none border-0 p-0 m-0",
                        header: "hidden",
                        socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all rounded-xl shadow-sm h-11",
                        socialButtonsBlockButtonText: "font-semibold text-sm",
                        dividerRow: "my-5",
                        dividerLine: "bg-white/10",
                        dividerText: "text-muted-foreground font-medium text-xs uppercase tracking-wider",
                        formFieldRow: "mb-4 space-y-1.5",
                        formFieldLabel: "text-muted-foreground text-xs font-medium",
                        formFieldInput: "bg-black/20 border border-white/10 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary rounded-xl h-11 shadow-inner transition-all",
                        formButtonPrimary: "bg-gradient-to-r from-primary to-info hover:opacity-90 shadow-md transition-opacity text-primary-foreground font-bold py-3 rounded-xl mt-4 w-full",
                        footer: "hidden",
                        identityPreviewText: "text-foreground font-medium",
                        identityPreviewEditButtonIcon: "text-primary hover:text-primary/80",
                        formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
                      },
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full border border-border/50 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Track smarter, land faster</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

