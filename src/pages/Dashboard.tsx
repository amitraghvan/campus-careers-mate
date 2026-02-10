import { OpportunityProvider } from "@/contexts/OpportunityContext";
import { StatsCards } from "@/components/StatsCards";
import { UpcomingDeadlines } from "@/components/UpcomingDeadlines";
import { StatusBreakdown } from "@/components/StatusBreakdown";
import { OpportunityList } from "@/components/OpportunityList";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <OpportunityProvider>
      <div className="min-h-screen bg-background relative">
        {/* Background effects */}
        <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="fixed inset-0 bg-radial-glow opacity-30 pointer-events-none" />
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight">PlaceTrack</h1>
              <p className="text-xs text-muted-foreground">Your placement command center</p>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
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
        </main>
      </div>
    </OpportunityProvider>
  );
};

export default Dashboard;

