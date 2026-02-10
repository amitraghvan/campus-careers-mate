/**
 * Activity Timeline — shows recent actions across all opportunities.
 */

import { useOpportunityContext } from "@/features/opportunities/contexts/OpportunityContext";
import { Opportunity } from "@/types";
import { Clock, Plus, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "@/utils/date";

interface TimelineEvent {
    id: string;
    icon: typeof Clock;
    iconColor: string;
    title: string;
    subtitle: string;
    time: string;
}

function buildTimeline(opportunities: Opportunity[]): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    const allHistory: { opp: Opportunity; status: string; date: string }[] = [];

    // Collect all history items
    opportunities.forEach((opp) => {
        if (opp.history && opp.history.length > 0) {
            opp.history.forEach((h) => {
                allHistory.push({ opp, status: h.status, date: h.date });
            });
        } else {
            // Fallback for old data or if history is empty
            allHistory.push({ opp, status: opp.status, date: opp.createdAt });
        }
    });

    // Sort by date descending
    const sorted = allHistory.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const item of sorted.slice(0, 8)) {
        const iconMap: Record<string, { icon: typeof Clock; color: string; verb: string }> = {
            wishlist: { icon: Plus, color: "text-info", verb: "Added to wishlist" },
            applied: { icon: ArrowUpRight, color: "text-primary", verb: "Applied" },
            interview: { icon: Clock, color: "text-warning", verb: "Interview scheduled" },
            selected: { icon: CheckCircle2, color: "text-success", verb: "Selected 🎉" },
            rejected: { icon: XCircle, color: "text-destructive", verb: "Not selected" },
        };

        // Default or unknown status
        const { icon, color, verb } = iconMap[item.status] || { icon: Clock, color: "text-muted", verb: "Updated" };

        events.push({
            id: `${item.opp.id}-${item.date}`,
            icon,
            iconColor: color,
            title: verb,
            subtitle: item.opp.company,
            time: formatDistanceToNow(item.date),
        });
    }

    return events;
}

export function ActivityTimeline() {
    const { opportunities } = useOpportunityContext();
    const events = buildTimeline(opportunities);

    if (events.length === 0) return null;

    return (
        <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-1">
                {events.map((event, i) => (
                    <div key={event.id + i} className="flex items-start gap-3 py-2 group">
                        <div className="mt-0.5 shrink-0">
                            <event.icon className={`h-4 w-4 ${event.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.subtitle}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                            {event.time}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

