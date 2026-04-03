import { motion } from "framer-motion";
import { Peer, OnlineStatus } from "../types/peer.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    UserPlus, MessageSquare, Clock, Check,
    Flame, Zap, Brain, Target, Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIPeerCardProps {
    peer: Peer;
    onConnect?: (id: string, requestId?: string) => void;
    onChat?: (id: string) => void;
    index?: number;
}

function OnlineDot({ status }: { status?: OnlineStatus }) {
    if (!status || status === "offline") return null;
    const colors: Record<string, string> = {
        online: "bg-green-400",
        studying: "bg-blue-400",
        focus: "bg-violet-500",
        idle: "bg-yellow-400",
    };
    const labels: Record<string, string> = {
        online: "Online",
        studying: "Studying",
        focus: "Focus Mode",
        idle: "Idle",
    };
    return (
        <span className="flex items-center gap-1">
            <span className={cn("h-2 w-2 rounded-full animate-pulse", colors[status])} />
            <span className="text-[10px] text-muted-foreground">{labels[status]}</span>
        </span>
    );
}

function MatchRing({ score }: { score: number }) {
    const color =
        score >= 80 ? "text-green-400 border-green-400/30 bg-green-400/10"
            : score >= 60 ? "text-blue-400 border-blue-400/30 bg-blue-400/10"
                : "text-muted-foreground border-border bg-secondary";
    return (
        <div className={cn(
            "flex flex-col items-center justify-center h-12 w-12 rounded-full border-2 shrink-0",
            color
        )}>
            <span className="text-xs font-bold leading-none">{score}%</span>
            <span className="text-[9px] leading-none opacity-70 mt-0.5">match</span>
        </div>
    );
}

export function AIPeerCard({ peer, onConnect, onChat, index = 0 }: AIPeerCardProps) {
    const hasMatch = (peer.matchScore ?? 0) > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, type: "spring", stiffness: 260, damping: 22 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group relative"
        >
            {/* AI Match Glow */}
            {peer.isAiMatch && (
                <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-violet-500/20 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}

            <div className={cn(
                "relative flex flex-col gap-4 p-5 rounded-xl border bg-card/60 backdrop-blur-sm transition-all duration-300",
                "hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5",
                peer.isAiMatch
                    ? "border-violet-500/20"
                    : "border-border/50"
            )}>
                {/* AI Match Badge */}
                {peer.isAiMatch && (
                    <div className="absolute -top-2.5 left-4">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-sm">
                            <Zap className="h-2.5 w-2.5" /> AI Pick
                        </span>
                    </div>
                )}

                {/* Header row */}
                <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 ring-2 ring-border/50 group-hover:ring-primary/20 transition-all">
                            {peer.avatarUrl && <AvatarImage src={peer.avatarUrl} />}
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">
                                {peer.avatar}
                            </AvatarFallback>
                        </Avatar>
                        {/* Online dot */}
                        {peer.onlineStatus && peer.onlineStatus !== "offline" && (
                            <span className={cn(
                                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-card border border-white/10",
                                peer.onlineStatus === "online" ? "bg-green-400" :
                                    peer.onlineStatus === "studying" ? "bg-blue-400" :
                                        peer.onlineStatus === "focus" ? "bg-violet-500" : "bg-yellow-400"
                            )} />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm leading-tight truncate">{peer.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{peer.college}</p>
                        <div className="mt-1">
                            <OnlineDot status={peer.onlineStatus} />
                        </div>
                        {peer.currentActivity && (
                            <p className="text-[10px] text-muted-foreground/70 italic mt-0.5 truncate">
                                "{peer.currentActivity}"
                            </p>
                        )}
                    </div>

                    {hasMatch && <MatchRing score={peer.matchScore!} />}
                </div>

                {/* Bio */}
                {peer.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed -mt-1">
                        {peer.bio}
                    </p>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-3 flex-wrap">
                    {(peer.streak ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-orange-400">
                            <Flame className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{peer.streak}d streak</span>
                        </div>
                    )}
                    {(peer.consistencyScore ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-blue-400">
                            <Brain className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{peer.consistencyScore}/100</span>
                        </div>
                    )}
                    {(peer.sharedGoals?.length ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-green-400">
                            <Target className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{peer.sharedGoals!.length} shared goals</span>
                        </div>
                    )}
                </div>

                {/* Skills */}
                {peer.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {peer.skills.slice(0, 4).map(skill => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="text-[10px] px-2 py-0.5 font-normal bg-secondary/60"
                            >
                                {skill}
                            </Badge>
                        ))}
                        {peer.skills.length > 4 && (
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-normal">
                                +{peer.skills.length - 4}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Target roles */}
                {peer.targetRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {peer.targetRoles.slice(0, 2).map(role => (
                            <span
                                key={role}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                            >
                                {role}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto pt-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 gap-1.5 text-xs hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                        onClick={() => onChat?.(peer.id)}
                    >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Message
                    </Button>

                    {peer.status === "CONNECTED" ? (
                        <Button size="sm" className="flex-1 h-8 gap-1.5 text-xs" disabled>
                            <Check className="h-3.5 w-3.5" /> Connected
                        </Button>
                    ) : peer.status === "PENDING" ? (
                        peer.requestId ? (
                            <Button
                                size="sm"
                                className="flex-1 h-8 gap-1.5 text-xs bg-green-600 hover:bg-green-700"
                                onClick={() => onConnect?.(peer.id, peer.requestId)}
                            >
                                <Check className="h-3.5 w-3.5" /> Accept
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline" className="flex-1 h-8 gap-1.5 text-xs" disabled>
                                <Clock className="h-3.5 w-3.5" /> Pending
                            </Button>
                        )
                    ) : (
                        <Button
                            size="sm"
                            className="flex-1 h-8 gap-1.5 text-xs bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 shadow-sm"
                            onClick={() => onConnect?.(peer.id)}
                        >
                            <UserPlus className="h-3.5 w-3.5" /> Connect
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
