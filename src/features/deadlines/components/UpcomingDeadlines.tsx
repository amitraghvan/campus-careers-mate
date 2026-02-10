/**
 * UpcomingDeadlines — sidebar widget showing nearest deadlines with urgency.
 */

import { useOpportunities } from "@/features/opportunities/hooks/use-opportunities";
import { STATUS_CONFIG } from "@/constants";
import { APP_CONFIG } from "@/config";
import { getDaysLeftLabel, getUrgencyStyles } from "@/utils";
import { CalendarDays } from "lucide-react";

export function UpcomingDeadlines() {
  const { opportunities } = useOpportunities();
  const now = new Date();

  const upcoming = opportunities
    .filter(
      (o) =>
        new Date(o.deadline) >= now &&
        o.status !== "selected" &&
        o.status !== "rejected"
    )
    .sort(
      (a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )
    .slice(0, APP_CONFIG.deadlines.maxUpcomingDisplay);

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
          <p className="text-sm text-muted-foreground py-6 text-center">
            No upcoming deadlines 🎉
          </p>
        ) : (
          <div className="space-y-1">
            {upcoming.map((opp) => {
              const urgency = getUrgencyStyles(opp.deadline);
              return (
                <div
                  key={opp.id}
                  className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 group hover:bg-secondary/30 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${urgency.dot} flex-shrink-0`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{opp.company}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {opp.role}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-md ${urgency.bg} ${urgency.text}`}
                    >
                      {getDaysLeftLabel(opp.deadline)}
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

