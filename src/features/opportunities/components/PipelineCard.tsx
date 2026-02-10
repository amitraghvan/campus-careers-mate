/**
 * PipelineCard — A simplified opportunity card for the Kanban board.
 */

import { Opportunity } from "@/types";
import { formatDistanceToNow } from "@/utils/date";
import { Briefcase, Calendar, Banknote } from "lucide-react";
import { motion } from "framer-motion";

interface PipelineCardProps {
    opportunity: Opportunity;
    isDragging?: boolean;
}

export function PipelineCard({ opportunity, isDragging }: PipelineCardProps) {
    return (
        <div
            className={`bg-card/90 backdrop-blur-sm border border-border/40 rounded-lg p-3 shadow-sm hover:shadow-md transition-all group ${isDragging ? "ring-2 ring-primary rotate-2 scale-105" : ""
                }`}
        >
            {/* Header */}
            <h4 className="font-semibold text-sm truncate">{opportunity.company}</h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Briefcase className="h-3 w-3 shrink-0" />
                <span className="truncate">{opportunity.role}</span>
            </div>

            {/* Details */}
            <div className="mt-3 space-y-1.5">
                {opportunity.package && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 rounded px-1.5 py-0.5 w-fit">
                        <Banknote className="h-3 w-3 shrink-0 text-success" />
                        <span className="font-medium text-foreground">{opportunity.package}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{formatDistanceToNow(opportunity.createdAt)}</span>
            </div>
        </div>
    );
}
