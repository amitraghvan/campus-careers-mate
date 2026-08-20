/**
 * Application Routes — single source of truth for all routing.
 */

import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/features/auth/components";

const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const AuthPage = lazy(() => import("@/features/auth/pages/AuthPage"));
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const ExplorePage = lazy(() => import("@/features/explore/pages/ExplorePage"));

// ── Network Hub ─────────────────────────────────────────────────────────────
const NetworkLayout      = lazy(() => import("@/features/network/pages/NetworkLayout"));
const PeerDiscoveryPage  = lazy(() => import("@/features/network/pages/PeerDiscoveryPage"));
const PeerMessagesPage   = lazy(() => import("@/features/network/pages/PeerMessagesPage"));
const PeerChatPage       = lazy(() => import("@/features/network/pages/PeerChatPage"));
const SquadsPage         = lazy(() => import("@/features/network/pages/SquadsPage"));
const ActivityFeedPage   = lazy(() => import("@/features/network/pages/ActivityFeedPage"));
const StudySessionsPage  = lazy(() => import("@/features/network/pages/StudySessionsPage"));
const VoiceRoomsPage     = lazy(() => import("@/features/network/pages/VoiceRoomsPage"));
const NetworkAnalyticsPage = lazy(() => import("@/features/network/pages/NetworkAnalyticsPage"));
const PeerProfilePage    = lazy(() => import("@/features/network/pages/PeerProfilePage"));

const PipelinePage       = lazy(() => import("@/features/opportunities/pages/PipelinePage"));
const AnalyticsPage      = lazy(() => import("@/features/analytics/pages/AnalyticsPage"));
const CalendarPage       = lazy(() => import("@/features/calendar/pages/CalendarPage"));
const NotesPage          = lazy(() => import("@/features/notes/pages/NotesPage"));
const ProfilePage        = lazy(() => import("@/features/profile/pages/ProfilePage"));
const NotFoundPage       = lazy(() => import("@/routes/pages/NotFoundPage"));
const DocumentsPage      = lazy(() => import("@/features/documents/pages/DocumentsPage"));
const ResumePage         = lazy(() => import("@/features/resume/pages/ResumePage"));
const HomeworkSolverPage = lazy(() => import("@/features/homework/pages/HomeworkSolverPage"));
const CodeExplainerPage  = lazy(() => import("@/features/homework/pages/CodeExplainerPage"));
const MockExamPage       = lazy(() => import("@/features/exam/pages/MockExamPage"));
const StudyPlannerPage   = lazy(() => import("@/features/study-planner/pages/StudyPlannerPage"));
const LearningAnalyticsPage = lazy(() => import("@/features/analytics/pages/LearningAnalyticsPage"));

// ── Python Learning (Unit I: Python Foundations) ───────────────────────────
const PythonDashboardPage  = lazy(() => import("@/features/python/pages/PythonDashboardPage"));
const PythonPhasePage      = lazy(() => import("@/features/python/pages/PythonPhasePage"));
const PythonChapterPage    = lazy(() => import("@/features/python/pages/PythonChapterPage"));
const PythonLessonPage     = lazy(() => import("@/features/python/pages/PythonLessonPage"));
const PythonPracticePage   = lazy(() => import("@/features/python/pages/PythonPracticePage"));
const PythonQuizPage       = lazy(() => import("@/features/python/pages/PythonQuizPage"));
const PythonAssessmentPage = lazy(() => import("@/features/python/pages/PythonAssessmentPage"));
const PythonProjectPage    = lazy(() => import("@/features/python/pages/PythonProjectPage"));
const PythonRevisionPage   = lazy(() => import("@/features/python/pages/PythonRevisionPage"));
const PythonExamModePage   = lazy(() => import("@/features/python/pages/PythonExamModePage"));

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />

          {/* ── Python Learning (Unit I & Unit II) ── */}
          <Route path="/python" element={<PythonDashboardPage />} />
          <Route path="/python/phase/:phaseId" element={<PythonPhasePage />} />
          <Route path="/python/phase/:phaseId/chapter/:chapterId" element={<PythonChapterPage />} />
          <Route path="/python/phase/:phaseId/chapter/:chapterId/lesson/:lessonId" element={<PythonLessonPage />} />
          <Route path="/python/phase/:phaseId/chapter/:chapterId/practice" element={<PythonPracticePage />} />
          <Route path="/python/phase/:phaseId/chapter/:chapterId/quiz" element={<PythonQuizPage />} />
          <Route path="/python/phase/:phaseId/assessment" element={<PythonAssessmentPage />} />
          <Route path="/python/phase/:phaseId/project" element={<PythonProjectPage />} />
          <Route path="/python/phase/:phaseId/project/:projectId" element={<PythonProjectPage />} />
          <Route path="/python/phase/:phaseId/revision" element={<PythonRevisionPage />} />
          <Route path="/python/phase/:phaseId/exam-mode" element={<PythonExamModePage />} />

          {/* ── Network Hub — nested layout with sub-nav ── */}
          <Route path="/network" element={<NetworkLayout />}>
            <Route index element={<PeerDiscoveryPage />} />
            <Route path="messages" element={<PeerMessagesPage />} />
            <Route path="squads" element={<SquadsPage />} />
            <Route path="feed" element={<ActivityFeedPage />} />
            <Route path="sessions" element={<StudySessionsPage />} />
            <Route path="rooms" element={<VoiceRoomsPage />} />
            <Route path="analytics" element={<NetworkAnalyticsPage />} />
            <Route path="profile/:id" element={<PeerProfilePage />} />
            {/* Legacy chat route preserved */}
            <Route path="chat" element={<PeerChatPage />} />
          </Route>

          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/homework" element={<HomeworkSolverPage />} />
          <Route path="/code-explainer" element={<CodeExplainerPage />} />
          <Route path="/mock-exams" element={<MockExamPage />} />
          <Route path="/ai-study-planner" element={<StudyPlannerPage />} />
          <Route path="/analytics/learning" element={<LearningAnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
