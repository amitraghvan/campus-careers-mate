import { useOpportunities } from "@/contexts/OpportunityContext";
import { STATUS_CONFIG, OpportunityStatus } from "@/types/opportunity";
import { Target, Clock, CheckCircle2, XCircle, Briefcase } from "lucide-react";

const STAT_ICONS: Record<string, React.ElementType> = {
  total: Briefcase,
  upcoming: Clock,
  selected: CheckCircle2,
  rejected: XCircle,
};

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
    { key: "total", label: "Total Opportunities", value: total, icon: Briefcase, accent: "text-foreground" },
    { key: "upcoming", label: "Upcoming Deadlines", value: upcoming, icon: Clock, accent: "text-warning" },
    { key: "selected", label: "Offers Received", value: selected, icon: CheckCircle2, accent: "text-success" },
    { key: "inProgress", label: "In Progress", value: inProgress, icon: Target, accent: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div
          key={s.key}
          className="glass-card rounded-lg p-5 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
        >
          <div className="flex items-center justify-between mb-3">
            <s.icon className={`h-5 w-5 ${s.accent}`} />
          </div>
          <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
