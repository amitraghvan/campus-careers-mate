/**
 * Pipeline Page — Kanban board view for managing opportunities.
 * Features: Drag & Drop, Status History Tracking, Animated Transitions.
 */

import React, { useState } from "react";
import { useOpportunityContext } from "@/features/opportunities/contexts/OpportunityContext";
import { Opportunity, OpportunityStatus } from "@/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { PipelineCard } from "@/features/opportunities/components/PipelineCard";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutList,
    Plus,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
} from "lucide-react";

const COLUMNS: { id: OpportunityStatus; title: string; icon: React.ElementType; color: string }[] = [
    { id: "wishlist", title: "Wishlist", icon: Plus, color: "text-blue-500" },
    { id: "applied", title: "Applied", icon: ArrowUpRight, color: "text-purple-500" },
    { id: "interview", title: "Interview", icon: Clock, color: "text-yellow-500" },
    { id: "selected", title: "Offer", icon: CheckCircle2, color: "text-green-500" },
    { id: "rejected", title: "Final", icon: XCircle, color: "text-red-500" }, // "Final" maps to rejected for simplicity, or we could filter
];

export default function PipelinePage() {
    const { opportunities, updateOpportunity } = useOpportunityContext();
    const [isDragEnabled, setIsDragEnabled] = useState(true);

    // Group opportunities by status
    const columns = COLUMNS.reduce((acc, col) => {
        acc[col.id] = opportunities.filter((o) => o.status === col.id);
        return acc;
    }, {} as Record<OpportunityStatus, Opportunity[]>);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as OpportunityStatus;

        // Optimistic UI update handled by re-render, context update causes re-render
        // Update status in context (which also adds history)
        updateOpportunity(draggableId, { status: newStatus });
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-display font-bold tracking-tight">Cold Email Pipeline</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your outreach and applications</p>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                    <div className="flex h-full gap-6 min-w-[1200px]">
                        {COLUMNS.map((col) => (
                            <div key={col.id} className="flex flex-col w-[280px] shrink-0">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-md bg-secondary/50 ${col.color}`}>
                                            <col.icon className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold text-sm">{col.title}</span>
                                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                            {columns[col.id]?.length || 0}
                                        </span>
                                    </div>
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Droppable Area */}
                                <div className="flex-1 bg-secondary/20 rounded-xl p-2 border border-border/30">
                                    <Droppable droppableId={col.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`h-full flex flex-col gap-3 overflow-y-auto pr-1 transition-colors ${snapshot.isDraggingOver ? "bg-primary/5" : ""
                                                    }`}
                                                style={{ minHeight: "100px" }}
                                            >
                                                {columns[col.id]?.map((opp, index) => (
                                                    <Draggable key={opp.id} draggableId={opp.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{ ...provided.draggableProps.style }}
                                                            >
                                                                <PipelineCard
                                                                    opportunity={opp}
                                                                    isDragging={snapshot.isDragging}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}
