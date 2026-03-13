/**
 * Dashboard Page — main command center view.
 */

import { OpportunityProvider } from "@/features/opportunities/contexts/OpportunityContext";
import { StatsCards, StatusBreakdown } from "@/features/dashboard/components";
import { UpcomingDeadlines } from "@/features/deadlines/components";
import { OpportunityList } from "@/features/opportunities/components";
import { ActivityTimeline } from "@/features/dashboard/components/ActivityTimeline";
import { DailyMomentumWidget } from "@/features/dashboard/components/DailyMomentumWidget";
import { PeersLikeYouWidget } from "@/features/network/components/PeersLikeYouWidget";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <OpportunityProvider>
      <div className="space-y-6">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your placement journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <DailyMomentumWidget />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <PeersLikeYouWidget />
        </motion.div>

        {/* AI Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <a href="/homework" className="glass-card p-4 rounded-xl flex items-center gap-4 hover:ring-1 hover:ring-primary/50 transition-all group">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="M4.5 15.5h15"/><path d="m15 11-1 9"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Homework Solver</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Step-by-step logic</p>
            </div>
          </a>
          <a href="/code-explainer" className="glass-card p-4 rounded-xl flex items-center gap-4 hover:ring-1 hover:info/50 transition-all group">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
              <svg className="h-5 w-5 text-info" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Code Explainer</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Debug & understand code</p>
            </div>
          </a>
          <a href="/mock-exams" className="glass-card p-4 rounded-xl flex items-center gap-4 hover:ring-1 hover:green-500/50 transition-all group">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Mock Exams</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Generate custom tests</p>
            </div>
          </a>
          <a href="/analytics/learning" className="glass-card p-4 rounded-xl flex items-center gap-4 hover:ring-1 hover:purple-500/50 transition-all group">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <svg className="h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Learning Analytics</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Track study progress</p>
            </div>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCards />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-4"
          >
            <UpcomingDeadlines />
            <StatusBreakdown />
            <ActivityTimeline />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <OpportunityList />
          </motion.div>
        </div>
      </div>
    </OpportunityProvider>
  );
}

