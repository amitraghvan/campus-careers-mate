import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowRight, UserPlus } from "lucide-react";
import { peerService } from "@/features/network/services/peer.service";
import { Peer } from "@/features/network/types/peer.types";

export function PeersLikeYouWidget() {
    const navigate = useNavigate();
    const [peers, setPeers] = useState<Peer[]>([]);

    useEffect(() => {
        const fetchPeers = async () => {
            try {
                const data = await peerService.getPeers();
                setPeers(data.slice(0, 3));
            } catch (error) {
                console.error("Failed to load peers widget", error);
            }
        };
        fetchPeers();
    }, []);

    return (
        <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-primary/5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="h-4 w-4" />
                    </div>
                    <h2 className="font-semibold text-lg">Peers Like You</h2>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-primary"
                    onClick={() => navigate("/network")}
                >
                    View Network <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {peers.map(peer => (
                    <div key={peer.id} className="bg-background rounded-lg p-3 border border-border/50 flex flex-col gap-3 hover:border-primary/20 transition-colors">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border border-border">
                                <AvatarFallback className="text-xs bg-secondary">{peer.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{peer.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{peer.college}</p>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <div className="flex flex-wrap gap-1 mb-2">
                                {peer.targetRoles.slice(0, 1).map(role => (
                                    <span key={role} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                        {role}
                                    </span>
                                ))}
                            </div>
                            <Button size="sm" variant="outline" className="w-full text-xs h-7 gap-1">
                                <UserPlus className="h-3 w-3" /> Connect
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
