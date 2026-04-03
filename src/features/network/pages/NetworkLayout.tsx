/**
 * NetworkLayout — Full-featured shell for all /network sub-pages.
 *
 * Sub-routes:
 *   /network              → Discover
 *   /network/messages     → Messages (DMs)
 *   /network/squads       → Squads (group rooms)
 *   /network/feed         → Activity Feed
 *   /network/sessions     → Study Sessions
 *   /network/rooms        → Voice Rooms
 *   /network/analytics    → Network Analytics
 *   /network/profile/:id  → Peer Profile
 *   /network/chat         → (legacy)
 */

import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Compass, MessageSquare, Users, Activity,
    Calendar, Volume2, BarChart3, Zap, Flame,
    Settings, Search, Bell, ArrowLeft, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ONLINE_COUNT = 24;
const AI_MATCHES   = 3;

const NETWORK_NAV = [
    { to: "/network",            exact: true,  icon: Compass,       label: "Discover",  badge: null,  color: "text-violet-400", bg: "bg-violet-500/10" },
    { to: "/network/messages",   exact: false, icon: MessageSquare, label: "Messages",  badge: "2",   color: "text-blue-400",   bg: "bg-blue-500/10" },
    { to: "/network/squads",     exact: false, icon: Users,         label: "Squads",    badge: "1",   color: "text-green-400",  bg: "bg-green-500/10" },
    { to: "/network/feed",       exact: false, icon: Activity,      label: "Feed",      badge: null,  color: "text-orange-400", bg: "bg-orange-500/10" },
    { to: "/network/sessions",   exact: false, icon: Calendar,      label: "Sessions",  badge: "1",   color: "text-pink-400",   bg: "bg-pink-500/10" },
    { to: "/network/rooms",      exact: false, icon: Volume2,       label: "Rooms",     badge: "3",   color: "text-cyan-400",   bg: "bg-cyan-500/10" },
    { to: "/network/analytics",  exact: false, icon: BarChart3,     label: "Analytics", badge: null,  color: "text-yellow-400", bg: "bg-yellow-500/10" },
];

export default function NetworkLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (to: string, exact: boolean) =>
        exact ? location.pathname === to : location.pathname.startsWith(to);

    return (
        <div className="flex flex-col h-full -m-4 sm:-m-6 lg:-m-8">
            {/* ── Top bar ── */}
            <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                            <Users className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="font-semibold text-sm">Peer Network</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 ml-2">
                        <span className="flex items-center gap-1 text-[11px] text-orange-400">
                            <Flame className="h-3 w-3" /> {ONLINE_COUNT} online
                        </span>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-1 text-[11px] text-violet-400">
                            <Zap className="h-3 w-3" /> {AI_MATCHES} AI matches
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-violet-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* ── Sub-nav tabs (scrollable) ── */}
            <div className="flex items-center gap-0.5 px-4 sm:px-6 h-11 border-b border-border/30 bg-background/50 shrink-0 overflow-x-auto no-scrollbar">
                {NETWORK_NAV.map((item) => {
                    const active = isActive(item.to, item.exact);
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            className={cn(
                                "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 shrink-0",
                                active
                                    ? `${item.color} ${item.bg}`
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                            )}
                        >
                            <item.icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{item.label}</span>
                            {item.badge && (
                                <span className="h-4 px-1 min-w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                            {active && (
                                <motion.div
                                    layoutId="network-tab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-current rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </NavLink>
                    );
                })}
            </div>

            {/* ── Page content ── */}
            <div className="flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}
