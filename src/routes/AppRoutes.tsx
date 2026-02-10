/**
 * Application Routes — single source of truth for all routing.
 * Clean separation of route config from rendering logic.
 */

import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/features/auth/components";

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const AuthPage = lazy(() => import("@/features/auth/pages/AuthPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const NotFoundPage = lazy(() => import("@/routes/pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
