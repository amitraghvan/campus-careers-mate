/**
 * VisualDiagramViewer Component
 * Renders rich, educational, responsive diagrams directly inside Python lessons:
 * - Decision flowcharts (If/Else, If-Elif-Else)
 * - Number line range visualizers (range(start, stop, step))
 * - 2D matrix grids (Nested loops)
 * - Step-by-step pipeline traces (Accumulators, Counters, Modulus)
 * - Iteration tables
 */

import { motion } from 'framer-motion';
import {
    GitBranch,
    Table,
    Layers,
    ArrowRight,
    ArrowDown,
    Check,
    X,
    Sparkles,
    Eye,
} from 'lucide-react';
import { VisualDiagram } from '../types/python.types';
import { cn } from '@/lib/utils';

interface VisualDiagramViewerProps {
    diagram: VisualDiagram;
}

export function VisualDiagramViewer({ diagram }: VisualDiagramViewerProps) {
    if (!diagram) return null;

    return (
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card/90 via-card/70 to-secondary/30 p-5 backdrop-blur-md shadow-sm space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                        <GitBranch className="h-4 w-4" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            Visual Concept Model
                        </span>
                        <h4 className="text-xs md:text-sm font-bold text-foreground">
                            {diagram.title}
                        </h4>
                    </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-secondary text-muted-foreground uppercase">
                    {diagram.type.replace('_', ' ')}
                </span>
            </div>

            {diagram.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                    {diagram.description}
                </p>
            )}

            {/* 1. Range Number Line Visualizer */}
            {diagram.type === 'number_line' && diagram.data && (
                <div className="py-4 px-3 bg-[#0d1117] rounded-xl border border-border/40 overflow-x-auto">
                    <div className="text-[11px] text-muted-foreground font-mono mb-3 text-center">
                        range({diagram.data.start ?? 0}, {diagram.data.stop}, {diagram.data.step ?? 1})
                    </div>

                    <div className="flex items-center justify-center gap-2 min-w-max px-4">
                        {Array.from(
                            { length: (diagram.data.stop ?? 5) - (diagram.data.start ?? 0) + 1 },
                            (_, idx) => {
                                const val = (diagram.data?.start ?? 0) + idx;
                                const isIncluded =
                                    val < (diagram.data?.stop ?? 5) &&
                                    (val - (diagram.data?.start ?? 0)) % (diagram.data?.step ?? 1) === 0;
                                const isExcludedStop = val === diagram.data?.stop;

                                return (
                                    <div key={idx} className="flex items-center">
                                        <div
                                            className={cn(
                                                'flex flex-col items-center justify-center p-2 rounded-lg border font-mono text-xs w-12 transition-all',
                                                isIncluded
                                                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold shadow-sm'
                                                    : isExcludedStop
                                                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 line-through opacity-80'
                                                    : 'bg-secondary/30 border-border/30 text-muted-foreground/50 opacity-40'
                                            )}
                                        >
                                            <span className="text-sm">{val}</span>
                                            <span className="text-[9px] mt-0.5">
                                                {isIncluded ? 'Included' : isExcludedStop ? 'Excluded' : 'Skipped'}
                                            </span>
                                        </div>

                                        {idx < (diagram.data?.stop ?? 5) - (diagram.data?.start ?? 0) && (
                                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 mx-1 shrink-0" />
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            {/* 2. Nested Loops 2D Matrix Grid */}
            {diagram.type === 'grid' && diagram.data?.gridSize && (
                <div className="p-4 bg-[#0d1117] rounded-xl border border-border/40 overflow-x-auto space-y-2">
                    <div className="text-[11px] text-muted-foreground font-mono text-center mb-2">
                        Outer Loop (i = rows) × Inner Loop (j = cols)
                    </div>

                    <div className="grid gap-2 max-w-sm mx-auto" style={{ gridTemplateColumns: `repeat(${diagram.data.gridSize.cols}, minmax(0, 1fr))` }}>
                        {Array.from({ length: diagram.data.gridSize.rows }).map((_, r) =>
                            Array.from({ length: diagram.data.gridSize.cols }).map((_, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className="p-2.5 rounded-lg bg-card/80 border border-primary/30 text-center font-mono text-xs flex flex-col items-center justify-center hover:border-primary transition-all"
                                >
                                    <span className="text-primary font-bold">({r}, {c})</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5">i={r}, j={c}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* 3. Execution / Iteration Table */}
            {diagram.type === 'table' && diagram.data?.headers && diagram.data?.rows && (
                <div className="rounded-xl border border-border/40 overflow-hidden bg-[#0d1117]">
                    <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-secondary/40 border-b border-border/40 text-muted-foreground text-[11px]">
                            <tr>
                                {diagram.data.headers.map((h, i) => (
                                    <th key={i} className="p-2.5 font-bold">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {diagram.data.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-secondary/20 transition-colors">
                                    {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="p-2.5 text-foreground/90">
                                            {String(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 4. Step Pipeline Trace (Accumulators / Modulus) */}
            {diagram.type === 'step_trace' && diagram.data?.steps && (
                <div className="p-4 bg-[#0d1117] rounded-xl border border-border/40 space-y-2">
                    <div className="space-y-2">
                        {diagram.data.steps.map((s, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/20 border border-border/30 text-xs font-mono"
                            >
                                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                                    {s.step}
                                </span>
                                <span className="font-semibold text-foreground">{s.label}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-emerald-400 font-bold">{s.value}</span>
                                {s.note && (
                                    <span className="text-[11px] text-muted-foreground/80 font-sans ml-auto">
                                        ({s.note})
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 5. Flowchart ASCII / Diagram Container */}
            {(diagram.type === 'flowchart' || diagram.type === 'custom' || diagram.diagramText) && diagram.diagramText && (
                <div className="p-4 rounded-xl bg-[#0d1117] border border-border/40 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre shadow-inner">
                    {diagram.diagramText}
                </div>
            )}
        </div>
    );
}
