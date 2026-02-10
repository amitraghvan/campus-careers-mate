/**
 * Dashboard Page — main command center view.
 */

import { OpportunityProvider } from "@/features/opportunities/contexts/OpportunityContext";
import { StatsCards, StatusBreakdown } from "@/features/dashboard/components";
import { UpcomingDeadlines } from "@/features/deadlines/components";
import { OpportunityList } from "@/features/opportunities/components";
import { ActivityTimeline } from "@/features/dashboard/components/ActivityTimeline";
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
