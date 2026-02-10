import { useOpportunities } from "@/contexts/OpportunityContext";
import { Target, Clock, CheckCircle2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function StatsCards() {
  const { opportunities } = useOpportunities();
  const now = new Date();

  const total = opportunities.length;
  const upcoming = opportunities.filter(
    (o) => new Date(o.deadline) >= now && o.status !== "selected" && o.status !== "rejected"
  ).length;
  const selected = opportunities.filter((o) => o.status === "selected").length;
  const inProgress = opportunities.filter((o) => o.status === "applied" || o.status === "interview").length;

  const stats = [
    { key: "total", label: "Total Opportunities", value: total, icon: Briefcase, gradient: "from-primary/20 to-info/20", iconColor: "text-primary", borderColor: "border-primary/20" },
    { key: "upcoming", label: "Upcoming Deadlines", value: upcoming, icon: Clock, gradient: "from-warning/20 to-destructive/10", iconColor: "text-warning", borderColor: "border-warning/20" },
    { key: "selected", label: "Offers Received", value: selected, icon: CheckCircle2, gradient: "from-success/20 to-primary/10", iconColor: "text-success", borderColor: "border-success/20" },
    { key: "inProgress", label: "In Progress", value: inProgress, icon: Target, gradient: "from-accent/20 to-primary/10", iconColor: "text-accent", borderColor: "border-accent/20" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className={`glass-card-hover rounded-xl p-5 relative overflow-hidden`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-30`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
            </div>
            <p className="text-3xl font-display font-bold tracking-tight">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

