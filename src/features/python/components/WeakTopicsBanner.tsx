/**
 * WeakTopicsBanner Component
 * Smart banner detecting low-scoring topics and offering actionable practice CTAs.
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopicMastery } from '../types/python.types';

interface WeakTopicsBannerProps {
    weakTopics: TopicMastery[];
}

export function WeakTopicsBanner({ weakTopics }: WeakTopicsBannerProps) {
    const navigate = useNavigate();

    if (!weakTopics || weakTopics.length === 0) {
        return null;
    }

    const primaryWeak = weakTopics[0];

    // Determine target practice route based on topic
    let targetRoute = '/python/phase/1/chapter/1/practice';
    if (['variables', 'types'].includes(primaryWeak.topic)) {
        targetRoute = '/python/phase/1/chapter/2/practice';
    } else if (['expressions', 'operators', 'strings'].includes(primaryWeak.topic)) {
        targetRoute = '/python/phase/1/chapter/3/practice';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-amber-900/10 to-card/60 p-4 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        >
            <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Target className="h-4.5 w-4.5" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            Recommended Practice
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                            Mastery: {primaryWeak.score}%
                        </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mt-0.5">
                        You seem to be having difficulty with {primaryWeak.displayName}.
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Solidify your foundations with targeted practice drills and step-by-step problem sets.
                    </p>
                </div>
            </div>

            <Button
                size="sm"
                onClick={() => navigate(targetRoute)}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 shrink-0 shadow-sm"
            >
                <span>Practice {primaryWeak.displayName}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
        </motion.div>
    );
}
