import { Peer } from "../types/peer.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, MessageSquare, Clock, Check } from "lucide-react";

interface MicroPortfolioCardProps {
    peer: Peer;
    onConnect?: (id: string) => void;
    onChat?: (id: string) => void;
}

export function MicroPortfolioCard({ peer, onConnect, onChat }: MicroPortfolioCardProps) {
    return (
        <Card className="p-5 flex flex-col gap-4 hover:border-primary/20 transition-all group relative overflow-hidden bg-card/50 backdrop-blur-sm">
            {/* Online Indicator */}
            {peer.isOnline && (
                <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-background/50" title="Online" />
            )}

            <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 border-2 border-border">
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {peer.avatar}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-lg leading-tight">{peer.name}</h3>
                    <p className="text-sm text-muted-foreground">{peer.degree} • {peer.college}</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">Batch of {peer.batch}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-secondary/30 rounded-lg p-3 text-sm italic text-muted-foreground border border-border/50">
                    "{peer.bio}"
                </div>

                <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Target Roles</p>
                    <div className="flex flex-wrap gap-1.5">
                        {peer.targetRoles.map(role => (
                            <Badge key={role} variant="secondary" className="text-xs font-normal">
                                {role}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                        {peer.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs text-muted-foreground">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-2">
                {peer.status === "CONNECTED" ? (
                    <Button
                        className="w-full gap-2"
                        variant="default"
                        onClick={() => onChat?.(peer.id)}
                    >
                        <MessageSquare className="h-4 w-4" /> Message
                    </Button>
                ) : peer.status === "PENDING" ? (
                    peer.requestId ? (
                        <Button
                            className="w-full gap-2"
                            variant="default"
                            onClick={() => onConnect?.(peer.id)}
                        >
                            <Check className="h-4 w-4" /> Accept Request
                        </Button>
                    ) : (
                        <Button className="w-full gap-2" variant="outline" disabled>
                            <Clock className="h-4 w-4" /> Request Sent
                        </Button>
                    )
                ) : (
                    <Button
                        className="w-full gap-2"
                        variant="outline"
                        onClick={() => onConnect?.(peer.id)}
                    >
                        <UserPlus className="h-4 w-4" /> Connect
                    </Button>
                )}
            </div>
        </Card>
    );
}
