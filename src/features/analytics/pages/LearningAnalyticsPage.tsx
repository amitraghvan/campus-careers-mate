/**
 * LearningAnalyticsPage — Placeholder for future learning insights.
 */

import { motion } from 'framer-motion';
import { BarChart3, Clock, Target, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';

export default function LearningAnalyticsPage() {
    return (
        <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BarChart3 className="text-primary" size={28} />
                        Learning Analytics Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Analyze your learning patterns, track study progress, and receive AI-powered insights.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 pt-4">
                {/* Learning Pattern Analysis Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="glass-card rounded-xl p-6 border border-white/5">
                        <div className="flex items-center gap-2 mb-6">
                            <Target className="text-info" size={20} />
                            <h2 className="text-lg font-bold">Learning Pattern Analysis</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8">
                            Track study time, mistakes, and topic performance.
                        </p>
                        
                        {/* Placeholder Content */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center text-center opacity-70">
                                <Clock className="text-slate-400 mb-2" size={24} />
                                <div className="text-2xl font-bold text-white mb-1">-- h</div>
                                <div className="text-xs text-muted-foreground">Study Time</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center text-center opacity-70">
                                <AlertTriangle className="text-yellow-400/70 mb-2" size={24} />
                                <div className="text-2xl font-bold text-white mb-1">--</div>
                                <div className="text-xs text-muted-foreground">Mistakes Tracked</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center text-center opacity-70">
                                <Target className="text-green-400/70 mb-2" size={24} />
                                <div className="text-2xl font-bold text-white mb-1">-- %</div>
                                <div className="text-xs text-muted-foreground">Avg. Topic Score</div>
                            </div>
                        </div>

                        <div className="mt-6 h-48 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center border-dashed">
                            <div className="text-center">
                                <BarChart3 className="mx-auto text-slate-500 mb-2" size={32} />
                                <span className="text-sm text-slate-500">Performance Chart (Coming Soon)</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Dashboard Placeholder */}
                    <div className="glass-card rounded-xl p-6 border border-white/5">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="text-green-400" size={20} />
                            <h2 className="text-lg font-bold">Progress Dashboard</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Graphs showing weekly study hours and score improvement.
                        </p>
                        <div className="h-48 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center border-dashed">
                            <div className="text-center">
                                <TrendingUp className="mx-auto text-slate-500 mb-2" size={32} />
                                <span className="text-sm text-slate-500">Progress Trends (Coming Soon)</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* AI Study Insights Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="glass-card rounded-xl p-6 border border-white/5 h-full min-h-[400px]">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="text-primary" size={20} />
                            <h2 className="text-lg font-bold">AI Study Insights</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8">
                            AI-generated suggestions to improve learning based on your performance.
                        </p>
                        
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5 opacity-50 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-600" />
                                    <div className="h-4 w-3/4 bg-slate-700/50 rounded mb-3"></div>
                                    <div className="h-3 w-full bg-slate-700/30 rounded mb-2"></div>
                                    <div className="h-3 w-5/6 bg-slate-700/30 rounded"></div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-primary/80">
                            Complete more mock exams and homework questions to generate your first set of insights!
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
