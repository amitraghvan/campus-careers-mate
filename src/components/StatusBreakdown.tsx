import { useOpportunities } from "@/contexts/OpportunityContext";
import { STATUS_CONFIG, OpportunityStatus } from "@/types/opportunity";

export function StatusBreakdown() {
  const { opportunities } = useOpportunities();

  const counts = (Object.keys(STATUS_CONFIG) as OpportunityStatus[]).map((status) => ({
    status,
    ...STATUS_CONFIG[status],
    count: opportunities.filter((o) => o.status === status).length,
  }));

  const total = opportunities.length || 1;

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
      <h2 className="font-semibold mb-4">Status Overview</h2>
      <div className="space-y-3">
        {counts.map((c) => (
          <div key={c.status}>
            <div className="flex justify-between text-sm mb-1">
              <span className={c.color}>{c.label}</span>
              <span className="text-muted-foreground">{c.count}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${c.bg.replace("/10", "")}`}
                style={{ width: `${(c.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
