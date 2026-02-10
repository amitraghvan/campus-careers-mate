/**
 * Dashboard Page — main command center view.
 */

import { OpportunityProvider } from "@/features/opportunities/contexts/OpportunityContext";
import { StatsCards, StatusBreakdown } from "@/features/dashboard/components";
import { UpcomingDeadlines } from "@/features/deadlines/components";
import { OpportunityList } from "@/features/opportunities/components";
import { PageContainer, ContentArea, AppHeader } from "@/components/layout";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <OpportunityProvider>
      <PageContainer>
        <AppHeader />
        <ContentArea className="space-y-6">
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
        </ContentArea>
      </PageContainer>
    </OpportunityProvider>
  );
}
