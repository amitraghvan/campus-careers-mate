/**
 * Analytics Page — charts and placement insights.
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, RadialBarChart, RadialBar, AreaChart, Area,
} from "recharts";
import { TrendingUp, Target, Award, Activity } from "lucide-react";
import type { Opportunity } from "@/types";
import { opportunityService } from "@/services";

const COLORS = {
    primary: "hsl(172 66% 50%)",
    accent: "hsl(260 60% 58%)",
    warning: "hsl(38 92% 55%)",
    success: "hsl(152 60% 45%)",
    destructive: "hsl(0 72% 55%)",
    info: "hsl(210 70% 55%)",
};

const STATUS_COLORS: Record<string, string> = {
    wishlist: COLORS.info,
    applied: COLORS.primary,
    interview: COLORS.warning,
    selected: COLORS.success,
    rejected: COLORS.destructive,
};

function useAnalyticsData() {
    const opportunities = opportunityService.getAll();

    return useMemo(() => {
        // Status distribution
        const statusMap: Record<string, number> = { wishlist: 0, applied: 0, interview: 0, selected: 0, rejected: 0 };
        opportunities.forEach((o) => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
        const statusData = Object.entries(statusMap).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            fill: STATUS_COLORS[name] || COLORS.info,
        }));

        // Package distribution
        const packageBuckets: Record<string, number> = {};
        opportunities.forEach((o) => {
            if (o.package) {
                const cleaned = o.package.replace(/[₹,]/g, "").trim();
                const lpaMatch = cleaned.match(/(\d+)/);
                if (lpaMatch) {
                    const lpa = parseInt(lpaMatch[1]);
                    let bucket = "0-5 LPA";
                    if (lpa >= 50) bucket = "50+ LPA";
                    else if (lpa >= 30) bucket = "30-50 LPA";
                    else if (lpa >= 20) bucket = "20-30 LPA";
                    else if (lpa >= 10) bucket = "10-20 LPA";
                    else if (lpa >= 5) bucket = "5-10 LPA";
                    packageBuckets[bucket] = (packageBuckets[bucket] || 0) + 1;
                }
            }
        });
        const packageData = Object.entries(packageBuckets)
            .sort(([a], [b]) => {
                const order = ["0-5 LPA", "5-10 LPA", "10-20 LPA", "20-30 LPA", "30-50 LPA", "50+ LPA"];
                return order.indexOf(a) - order.indexOf(b);
            })
            .map(([name, value]) => ({ name, value }));

        // Success rate
        const total = opportunities.length || 1;
        const selected = opportunities.filter((o) => o.status === "selected").length;
        const successRate = Math.round((selected / total) * 100);

        // Monthly trend
        const monthMap: Record<string, number> = {};
        opportunities.forEach((o) => {
            const d = new Date(o.createdAt);
            const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
            monthMap[key] = (monthMap[key] || 0) + 1;
        });
        const trendData = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

        // Weekly activity (last 8 weeks)
        const weekData: { week: string; apps: number }[] = [];
        const now = new Date();
        for (let i = 7; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - i * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);
            const apps = opportunities.filter((o) => {
                const d = new Date(o.createdAt);
                return d >= weekStart && d < weekEnd;
            }).length;
            weekData.push({
                week: `W${8 - i}`,
                apps,
            });
        }

        return { statusData, packageData, successRate, trendData, weekData, total, selected };
    }, [opportunities]);
}

function ChartCard({ title, icon: Icon, children }: { title: string; icon: typeof TrendingUp; children: React.ReactNode }) {
    return (
        <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Icon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function AnalyticsPage() {
    const { statusData, packageData, successRate, trendData, weekData, total, selected } = useAnalyticsData();

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-display font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground text-sm mt-1">Insights into your placement journey</p>
            </motion.div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Applications", value: total, color: "text-primary" },
                    { label: "Offers Received", value: selected, color: "text-success" },
                    { label: "Success Rate", value: `${successRate}%`, color: "text-warning" },
                    { label: "Active Pipeline", value: total - selected - (statusData.find(s => s.name === "Rejected")?.value || 0), color: "text-info" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card rounded-xl p-4 text-center"
                    >
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Status Distribution - Pie */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <ChartCard title="Status Distribution" icon={Target}>
                        <div className="h-64">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(230 20% 11%)",
                                            borderColor: "hsl(230 15% 18%)",
                                            borderRadius: "8px",
                                            color: "hsl(210 40% 96%)",
                                            fontSize: "12px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 justify-center">
                            {statusData.map((s) => (
                                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                                    <span className="text-muted-foreground">{s.name}: {s.value}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </motion.div>

                {/* Package Distribution - Bar */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <ChartCard title="Package Distribution" icon={Award}>
                        <div className="h-64">
                            <ResponsiveContainer>
                                <BarChart data={packageData.length > 0 ? packageData : [{ name: "No data", value: 0 }]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 18%)" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }}
                                        axisLine={{ stroke: "hsl(230 15% 18%)" }}
                                    />
                                    <YAxis
                                        tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }}
                                        axisLine={{ stroke: "hsl(230 15% 18%)" }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(230 20% 11%)",
                                            borderColor: "hsl(230 15% 18%)",
                                            borderRadius: "8px",
                                            color: "hsl(210 40% 96%)",
                                            fontSize: "12px",
                                        }}
                                    />
                                    <Bar dataKey="value" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </motion.div>

                {/* Application Trend - Area */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <ChartCard title="Application Trend" icon={TrendingUp}>
                        <div className="h-64">
                            <ResponsiveContainer>
                                <AreaChart data={trendData.length > 0 ? trendData : [{ month: "No data", count: 0 }]}>
                                    <defs>
                                        <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 18%)" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }}
                                        axisLine={{ stroke: "hsl(230 15% 18%)" }}
                                    />
                                    <YAxis
                                        tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }}
                                        axisLine={{ stroke: "hsl(230 15% 18%)" }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(230 20% 11%)",
                                            borderColor: "hsl(230 15% 18%)",
                                            borderRadius: "8px",
                                            color: "hsl(210 40% 96%)",
                                            fontSize: "12px",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke={COLORS.primary}
                                        fill="url(#gradientPrimary)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </motion.div>

                {/* Success Rate - Radial */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <ChartCard title="Success Rate" icon={Activity}>
                        <div className="h-64 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="60%"
                                    outerRadius="90%"
                                    data={[{ name: "Success", value: successRate, fill: COLORS.success }]}
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <RadialBar
                                        dataKey="value"
                                        background={{ fill: "hsl(230 15% 16%)" }}
                                        cornerRadius={10}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute text-center">
                                <p className="text-3xl font-bold text-success">{successRate}%</p>
                                <p className="text-xs text-muted-foreground">Conversion</p>
                            </div>
                        </div>
                    </ChartCard>
                </motion.div>
            </div>
        </div>
    );
}
