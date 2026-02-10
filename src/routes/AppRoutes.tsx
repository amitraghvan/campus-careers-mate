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
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const AnalyticsPage = lazy(() => import("@/features/analytics/pages/AnalyticsPage"));
const CalendarPage = lazy(() => import("@/features/calendar/pages/CalendarPage"));
const NotesPage = lazy(() => import("@/features/notes/pages/NotesPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
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

        {/* Protected routes with sidebar layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
