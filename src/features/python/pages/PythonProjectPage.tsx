/**
 * PythonProjectPage Component (/python/phase/:phaseId/project/:projectId?)
 * Supports Phase 1 Capstone Project and all 3 Phase 2 Mini-Projects:
 * 1. Multi-Round Dice Simulator
 * 2. Number Guessing Game Engine
 * 3. Rock Paper Scissors Tournament
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    CheckCircle2,
    Trophy,
    ArrowRight,
    Zap,
    BookOpen,
    Code2,
    Check,
    Layers,
    Dice5,
    Gamepad2,
    Swords,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonHeader } from '../components/PythonHeader';
import { PythonEditor } from '../components/PythonEditor';
import { AIHintSystem } from '../components/AIHintSystem';
import { BadgeCelebrationModal } from '../components/BadgeCelebrationModal';
import { PHASE_1_PROJECT } from '../data/python-phase1.data';
import { PHASE_2_PROJECTS } from '../data/python-phase2.data';
import { usePythonState } from '../hooks/usePythonState';
import { PythonBadge, PythonProject } from '../types/python.types';
import { cn } from '@/lib/utils';

export default function PythonProjectPage() {
    const { phaseId, projectId } = useParams();
    const navigate = useNavigate();
    const { state, completeProject, recordHintUsage, badges } = usePythonState();

    const currentPhase = parseInt(phaseId || '1', 10);
    const isPhase2 = currentPhase === 2;

    // Resolve active project
    let project: PythonProject = PHASE_1_PROJECT;
    if (isPhase2) {
        project =
            PHASE_2_PROJECTS.find((p) => p.id === projectId) ||
            PHASE_2_PROJECTS[0];
    }

    const [celebrationBadge, setCelebrationBadge] = useState<PythonBadge | null>(null);

    const isAlreadyDone = isPhase2
        ? state.completedProjects?.includes(project.id) || false
        : state.projectCompleted;

    const handleProjectSuccess = (code: string) => {
        completeProject(project.id, code, project.xpReward);

        if (isPhase2) {
            const badge = badges.find((b) => b.title === project.badgeName);
            if (badge) setCelebrationBadge(badge);
        } else {
            const foundationBadge = badges.find((b) => b.id === 'PYTHON_FOUNDATION');
            if (foundationBadge) setCelebrationBadge(foundationBadge);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={isPhase2 ? `Phase 2 Mini-Project: ${project.title}` : 'Phase 1 Capstone Project'}
                subtitle={project.title}
                showBack
                backTo={`/python/phase/${currentPhase}`}
            />

            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-16">
                {/* Phase 2 Project Selector Tabs */}
                {isPhase2 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {PHASE_2_PROJECTS.map((p, idx) => {
                            const isSelected = p.id === project.id;
                            const isDone = state.completedProjects?.includes(p.id);

                            return (
                                <button
                                    key={p.id}
                                    onClick={() => navigate(`/python/phase/2/project/${p.id}`)}
                                    className={cn(
                                        'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border',
                                        isSelected
                                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                            : 'bg-secondary/40 text-muted-foreground hover:bg-secondary border-border/40'
                                    )}
                                >
                                    <span>Project {idx + 1}: {p.title}</span>
                                    {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Hero Header */}
                <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card to-card/60 p-6 md:p-8 relative overflow-hidden shadow-elevated">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                                {isPhase2 ? "Interactive Game Project" : "Capstone Project Milestone"}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-display font-black text-foreground">
                                {project.title}
                            </h1>
                            <p className="text-xs md:text-sm text-muted-foreground max-w-xl">
                                {project.overview}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                            <Zap className="h-4 w-4 text-amber-400" />
                            <span>+{project.xpReward} XP Reward</span>
                        </div>
                    </div>
                </div>

                {/* Success Banner if Completed */}
                {isAlreadyDone && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 flex items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground">
                                    Project Built & Verified! 🎉
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    You have earned the +{project.xpReward} XP reward for {project.title}.
                                </p>
                            </div>
                        </div>

                        <Button
                            size="sm"
                            onClick={() => navigate(`/python/phase/${currentPhase}`)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs h-8"
                        >
                            Return to Phase Hub
                        </Button>
                    </motion.div>
                )}

                {/* Requirements & Problem Statement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md space-y-3">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Problem Statement & Architecture
                        </h3>
                        <p className="text-xs md:text-sm text-foreground/90 leading-relaxed font-sans">
                            {project.problemStatement}
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md space-y-3">
                        <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            System Requirements
                        </h3>
                        <ul className="space-y-1.5 text-xs text-foreground/90 font-medium">
                            {project.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sample Output Card */}
                <div className="p-4 rounded-2xl bg-[#0d1117] border border-border/50 font-mono text-xs space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block border-b border-border/30 pb-1.5">
                        Sample Target Output
                    </span>
                    <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                        {project.sampleOutput}
                    </pre>
                </div>

                {/* Interactive Project Editor & Test Runner */}
                <div className="space-y-3">
                    <h2 className="text-lg md:text-xl font-display font-bold text-foreground flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        Project Implementation & Test Arena
                    </h2>

                    <PythonEditor
                        initialCode={project.starterCode}
                        starterCode={project.starterCode}
                        testCases={project.testCases}
                        onSuccess={handleProjectSuccess}
                        submitButtonLabel="Submit & Verify Project"
                    />
                </div>

                {/* Progressive AI Hint System */}
                <AIHintSystem
                    hints={project.hints}
                    solutionCode={project.solutionCode}
                    solutionExplanation="Review the clean reference implementation above to compare architectural structure and logic flow."
                    entityId={project.id}
                    onRevealHint={(lvl) => recordHintUsage(project.id, lvl)}
                />
            </main>

            {/* Badge Celebration Pop-up */}
            <BadgeCelebrationModal
                badge={celebrationBadge}
                isOpen={!!celebrationBadge}
                onClose={() => setCelebrationBadge(null)}
            />
        </div>
    );
}
