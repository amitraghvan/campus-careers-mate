/**
 * StatusBreakdown — visual pipeline showing status distribution.
 */

import { useOpportunities } from "@/features/opportunities/hooks/use-opportunities";
import { STATUS_CONFIG } from "@/constants";
import type { OpportunityStatus } from "@/types";
import { PieChart } from "lucide-react";

export function StatusBreakdown() {
  const { opportunities } = useOpportunities();

  const counts = (Object.keys(STATUS_CONFIG) as OpportunityStatus[]).map((status) => ({
    status,
    ...STATUS_CONFIG[status],
    count: opportunities.filter((o) => o.status === status).length,
  }));

  const total = opportunities.length || 1;

  return (
    <div className="glass-card rounded-xl p-5 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px]" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <PieChart className="h-4 w-4 text-accent" />
          </div>
          <h2 className="font-display font-semibold">Status Overview</h2>
        </div>

        {/* Visual bar */}
        <div className="flex h-3 rounded-full overflow-hidden mb-5 bg-secondary">
          {counts.map(
            (c) =>
              c.count > 0 && (
                <div
                  key={c.status}
                  className={`${c.dotColor} transition-all duration-700 first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${(c.count / total) * 100}%` }}
                />
              )
          )}
        </div>

        <div className="space-y-3">
          {counts.map((c) => (
            <div key={c.status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${c.dotColor}`} />
                <span className="text-sm">{c.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{c.count}</span>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {Math.round((c.count / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
