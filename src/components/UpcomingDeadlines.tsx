import { useOpportunities } from "@/contexts/OpportunityContext";
import { STATUS_CONFIG } from "@/types/opportunity";
import { CalendarDays, AlertTriangle } from "lucide-react";

export function UpcomingDeadlines() {
  const { opportunities } = useOpportunities();
  const now = new Date();

  const upcoming = opportunities
    .filter((o) => new Date(o.deadline) >= now && o.status !== "selected" && o.status !== "rejected")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const getDaysLeft = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - now.getTime()) / 86400000);
    if (diff === 0) return "Today!";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
  };

  const getUrgencyStyle = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - now.getTime()) / 86400000);
    if (diff <= 2) return { text: "text-destructive", bg: "bg-destructive/10", dot: "bg-destructive" };
    if (diff <= 5) return { text: "text-warning", bg: "bg-warning/10", dot: "bg-warning" };
    return { text: "text-muted-foreground", bg: "bg-muted", dot: "bg-muted-foreground" };
  };

  return (
    <div className="glass-card rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-[60px]" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-warning" />
          </div>
          <h2 className="font-display font-semibold">Upcoming Deadlines</h2>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No upcoming deadlines 🎉</p>
        ) : (
          <div className="space-y-1">
            {upcoming.map((opp) => {
              const config = STATUS_CONFIG[opp.status];
              const urgency = getUrgencyStyle(opp.deadline);
              return (
                <div key={opp.id} className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 group hover:bg-secondary/30 -mx-2 px-2 rounded-lg transition-colors">
                  <div className={`h-2 w-2 rounded-full ${urgency.dot} flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{opp.company}</p>
                    <p className="text-xs text-muted-foreground truncate">{opp.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${urgency.bg} ${urgency.text}`}>
                      {getDaysLeft(opp.deadline)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

