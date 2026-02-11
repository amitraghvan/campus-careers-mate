import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Users, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { peerService } from "../services/peer.service";
import { MicroPortfolioCard } from "../components/MicroPortfolioCard";
import { Peer } from "../types/peer.types";
import { useNavigate } from "react-router-dom";

export default function PeerDiscoveryPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"ALL" | "SDE" | "DATA">("ALL");

    // Mock user update logic for now
    const [peers, setPeers] = useState<Peer[]>(peerService.getPeers());

    const handleConnect = (id: string) => {
        setPeers(current => current.map(p =>
            p.id === id ? { ...p, status: "PENDING" } : p
        ));
    };

    const handleChat = (id: string) => {
        // Navigate to chat or open chat widget
        // For now, we'll just log or show an alert (in a real app, this goes to /network/chat/:id)
        console.log("Open chat with", id);
    };

    const filteredPeers = peers.filter(peer => {
        const matchesSearch = peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            peer.college.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "ALL" || peer.targetRoles.some(r => r.toUpperCase().includes(filter));
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4"
                >
                    <Users className="h-3.5 w-3.5" />
                    <span>Peer Connect Network</span>
                </motion.div>
                <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Find your tribe.</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Connect with students who share your goals. Collaborative preparation, zero noise.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, college, or role..."
                        className="pl-9 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
                    <Button
                        variant={filter === "ALL" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("ALL")}
                    >
                        All Peers
                    </Button>
                    <Button
                        variant={filter === "SDE" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("SDE")}
                    >
                        SDE Aspirants
                    </Button>
                    <Button
                        variant={filter === "DATA" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("DATA")}
                    >
                        Data Roles
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPeers.map((peer, i) => (
                    <motion.div
                        key={peer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <MicroPortfolioCard
                            peer={peer}
                            onConnect={handleConnect}
                            onChat={handleChat}
                        />
                    </motion.div>
                ))}
            </div>

            {filteredPeers.length === 0 && (
                <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed">
                    <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No peers found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
