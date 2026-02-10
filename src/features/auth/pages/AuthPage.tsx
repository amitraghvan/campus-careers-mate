/**
 * AuthPage — Sign In / Sign Up page with toggle.
 * Beautiful glassmorphic card with animated background.
 */

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import { SignInForm, SignUpForm, SocialDivider } from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks";
import { APP_CONFIG } from "@/config";
import type { AuthMode } from "@/features/auth/types";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // If already logged in, redirect to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to={APP_CONFIG.routes.dashboard} replace />;
  }

  const handleSuccess = () => {
    navigate(APP_CONFIG.routes.dashboard, { replace: true });
  };

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

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary mb-4">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              {APP_CONFIG.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "sign-in"
                ? "Welcome back! Sign in to continue."
                : "Create your account to get started."}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-xl bg-secondary/50 p-1 mb-6">
            <button
              onClick={() => setMode("sign-in")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "sign-in"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("sign-up")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "sign-up"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "sign-in" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "sign-in" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {mode === "sign-in" ? (
                <SignInForm onSuccess={handleSuccess} />
              ) : (
                <SignUpForm onSuccess={handleSuccess} />
              )}
            </motion.div>
          </AnimatePresence>

          <SocialDivider />

          {/* Bottom text */}
          <p className="text-center text-xs text-muted-foreground">
            {mode === "sign-in" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setMode("sign-up")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("sign-in")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3 w-3 text-primary" />
          <span>Track smarter, land faster</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

