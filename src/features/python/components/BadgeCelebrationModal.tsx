/**
 * BadgeCelebrationModal Component
 * Animated modal pop-up celebrating unlocked badges and milestones.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonBadge } from '../types/python.types';

interface BadgeCelebrationModalProps {
    badge: PythonBadge | null;
    onClose: () => void;
}

export function BadgeCelebrationModal({ badge, onClose }: BadgeCelebrationModalProps) {
    if (!badge) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/75 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-gradient-to-b from-card via-card to-[#0d1117] border border-primary/40 rounded-2xl p-6 shadow-2xl z-10 text-center space-y-4 glow-primary"
                >
                    {/* Badge Icon Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1], rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-tr from-primary/20 via-accent/20 to-amber-500/20 border border-primary/40 flex items-center justify-center text-4xl shadow-lg"
                    >
                        {badge.icon}
                    </motion.div>

                    <div>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> Badge Unlocked!
                        </span>
                        <h3 className="text-xl font-display font-bold text-foreground mt-1">
                            {badge.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {badge.description}
                        </p>
                    </div>

                    <div className="py-2 px-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold inline-flex items-center gap-1.5 mx-auto">
                        <Zap className="h-4 w-4" />
                        <span>+{badge.xpValue} XP Earned</span>
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs glow-primary mt-2"
                    >
                        Awesome! Continue
                    </Button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
