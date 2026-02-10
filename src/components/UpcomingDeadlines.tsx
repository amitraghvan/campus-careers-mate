import { useOpportunities } from "@/contexts/OpportunityContext";
import { STATUS_CONFIG } from "@/types/opportunity";
import { CalendarDays } from "lucide-react";

export function UpcomingDeadlines() {
  const { opportunities } = useOpportunities();
  const now = new Date();

  const upcoming = opportunities
    .filter((o) => new Date(o.deadline) >= now && o.status !== "selected" && o.status !== "rejected")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const getDaysLeft = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - now.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
  };

  const getUrgencyClass = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - now.getTime()) / 86400000);
    if (diff <= 2) return "text-destructive font-medium";
    if (diff <= 5) return "text-warning font-medium";
    return "text-muted-foreground";
  };

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in" style={{ animationDelay: "320ms", animationFillMode: "both" }}>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-warning" />
        <h2 className="font-semibold">Upcoming Deadlines</h2>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No upcoming deadlines 🎉</p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((opp) => {
            const config = STATUS_CONFIG[opp.status];
            return (
              <div key={opp.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{opp.company}</p>
                  <p className="text-xs text-muted-foreground truncate">{opp.role}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className={`text-sm ${getUrgencyClass(opp.deadline)}`}>{getDaysLeft(opp.deadline)}</p>
                  <span className={`text-xs ${config.color}`}>{config.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
