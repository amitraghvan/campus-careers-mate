/**
 * Calendar Page — view deadlines and interviews on a calendar.
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Building2 } from "lucide-react";
import type { Opportunity } from "@/types";
import { opportunityService } from "@/services";
import { formatDate } from "@/utils/date";

const STATUS_DOT_COLORS: Record<string, string> = {
    wishlist: "bg-info",
    applied: "bg-primary",
    interview: "bg-warning",
    selected: "bg-success",
    rejected: "bg-destructive",
};

const STATUS_BADGE_COLORS: Record<string, string> = {
    wishlist: "bg-info/10 text-info",
    applied: "bg-primary/10 text-primary",
    interview: "bg-warning/10 text-warning",
    selected: "bg-success/10 text-success",
    rejected: "bg-destructive/10 text-destructive",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Pad start
    const startPad = firstDay.getDay();
    for (let i = startPad - 1; i >= 0; i--) {
        const d = new Date(year, month, -i);
        days.push(d);
    }

    // Month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }

    // Pad end
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
            days.push(new Date(year, month + 1, i));
        }
    }

    return days;
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const opportunities = opportunityService.getAll();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

    const deadlineMap = useMemo(() => {
        const map = new Map<string, Opportunity[]>();
        opportunities.forEach((o) => {
            const d = new Date(o.deadline);
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(o);
        });
        return map;
    }, [opportunities]);

    const selectedOpps = useMemo(() => {
        if (!selectedDate) return [];
        const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
        return deadlineMap.get(key) || [];
    }, [selectedDate, deadlineMap]);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-display font-bold tracking-tight">Calendar</h1>
                <p className="text-muted-foreground text-sm mt-1">Deadlines and interviews at a glance</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-card rounded-xl p-5"
                >
                    {/* Month header */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={prevMonth} className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors text-sm">←</button>
                        <h2 className="text-lg font-display font-semibold">
                            {MONTHS[month]} {year}
                        </h2>
                        <button onClick={nextMonth} className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors text-sm">→</button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map((d) => (
                            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, i) => {
                            const isCurrentMonth = day.getMonth() === month;
                            const isToday = isSameDay(day, today);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                            const opps = deadlineMap.get(key) || [];

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(day)}
                                    className={`relative h-14 sm:h-16 rounded-lg flex flex-col items-center justify-start pt-1.5 transition-all text-sm
                    ${!isCurrentMonth ? "opacity-30" : ""}
                    ${isToday ? "ring-1 ring-primary/50" : ""}
                    ${isSelected ? "bg-primary/15 ring-1 ring-primary" : "hover:bg-secondary/50"}
                  `}
                                >
                                    <span className={`text-xs font-medium ${isToday ? "text-primary font-bold" : ""}`}>
                                        {day.getDate()}
                                    </span>
                                    {opps.length > 0 && (
                                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                                            {opps.slice(0, 3).map((o, j) => (
                                                <div
                                                    key={j}
                                                    className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_COLORS[o.status]}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 mt-4 justify-center">
                        {Object.entries(STATUS_DOT_COLORS).map(([status, color]) => (
                            <div key={status} className="flex items-center gap-1.5 text-xs">
                                <div className={`h-2 w-2 rounded-full ${color}`} />
                                <span className="text-muted-foreground capitalize">{status}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Selected day details */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card rounded-xl p-5"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">
                            {selectedDate ? formatDate(selectedDate.toISOString()) : "Select a date"}
                        </h3>
                    </div>

                    {selectedOpps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
                            <p className="text-sm text-muted-foreground">
                                {selectedDate ? "No deadlines on this day" : "Click a date to see details"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedOpps.map((opp) => (
                                <div key={opp.id} className="p-3 rounded-lg bg-secondary/30 border border-border/20 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="text-sm font-medium">{opp.company}</span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE_COLORS[opp.status]}`}>
                                            {opp.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-6">{opp.role}</p>
                                    {opp.package && (
                                        <p className="text-xs text-primary ml-6">{opp.package}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

