/**
 * Activity Timeline — shows recent actions across all opportunities.
 */

import { useOpportunityContext } from "@/features/opportunities/contexts/OpportunityContext";
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

function buildTimeline(opportunities: { company: string; status: string; createdAt: string }[]): TimelineEvent[] {
    const events: TimelineEvent[] = [];

    const sorted = [...opportunities].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (const opp of sorted.slice(0, 8)) {
        const iconMap: Record<string, { icon: typeof Clock; color: string; verb: string }> = {
            wishlist: { icon: Plus, color: "text-info", verb: "Added to wishlist" },
            applied: { icon: ArrowUpRight, color: "text-primary", verb: "Applied" },
            interview: { icon: Clock, color: "text-warning", verb: "Interview scheduled" },
            selected: { icon: CheckCircle2, color: "text-success", verb: "Selected 🎉" },
            rejected: { icon: XCircle, color: "text-destructive", verb: "Not selected" },
        };

        const { icon, color, verb } = iconMap[opp.status] || iconMap.wishlist;

        events.push({
            id: `${opp.company}-${opp.createdAt}`,
            icon,
            iconColor: color,
            title: verb,
            subtitle: opp.company,
            time: formatDistanceToNow(opp.createdAt),
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

