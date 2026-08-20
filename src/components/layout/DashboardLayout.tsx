/**
 * DashboardLayout — persistent sidebar + main content area.
 * Wraps all protected pages with a consistent navigation sidebar.
 */

import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    BarChart3,
    CalendarDays,
    StickyNote,
    User,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Mail,
    Globe,
    Users,
    FileText,
    FileEdit,
    BrainCircuit,
    TerminalSquare,
    FileQuestion,
    BookOpen,
    Zap,
    Flame,
    Code2,
} from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { APP_CONFIG } from "@/config";
import { cn } from "@/lib/utils";
import { OpportunityProvider } from "@/features/opportunities/contexts/OpportunityContext";
import { MomentumProvider } from "@/features/dashboard/contexts/MomentumContext";

// Simulated live peer presence counters (real values come from backend/WebSocket)
const PEER_ONLINE_COUNT = 24;
const PEER_AI_MATCHES = 3;

const NAV_ITEMS = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/python", icon: Code2, label: "Python Learning", badge: "Unit I" },
    { to: "/explore", icon: Globe, label: "Explore" },
    { to: "/network", icon: Users, label: "Peer Connect", special: true },
    { to: "/pipeline", icon: Mail, label: "Cold Email" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/calendar", icon: CalendarDays, label: "Calendar" },
    { to: "/notes", icon: StickyNote, label: "Notes" },
    { to: "/ai-study-planner", icon: BookOpen, label: "AI Study Planner" },
    { to: "/documents", icon: FileText, label: "AI Learning Hub" },
    { to: "/homework", icon: BrainCircuit, label: "Homework Solver" },
    { to: "/code-explainer", icon: TerminalSquare, label: "Code Explainer" },
    { to: "/mock-exams", icon: FileQuestion, label: "Mock Exams" },
    { to: "/resume", icon: FileEdit, label: "Resume Builder" },
    { to: "/profile", icon: User, label: "Profile" },
];

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <OpportunityProvider>
            <MomentumProvider>
                <div className="min-h-screen bg-background flex">
                    <AnimatePresence>
                        {mobileOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                                onClick={() => setMobileOpen(false)}
                            />
                        )}
                    </AnimatePresence>

                    {/* Sidebar */}
                    <aside
                        className={cn(
                            "fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-border/40 bg-[hsl(var(--sidebar-background))] transition-all duration-300 ease-in-out",
                            collapsed ? "lg:w-[72px]" : "lg:w-[240px]",
                            mobileOpen ? "w-[260px] translate-x-0" : "w-[260px] -translate-x-full lg:translate-x-0"
                        )}
                    >
                        {/* Logo — click to go to landing page */}
                        <div className={cn(
                            "flex items-center gap-3 px-4 h-16 border-b border-border/30 shrink-0",
                            collapsed && "justify-center px-0"
                        )}>
                            <button
                                onClick={() => navigate("/")}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary shrink-0">
                                    <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
                                </div>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-lg font-display font-bold tracking-tight whitespace-nowrap"
                                    >
                                        {APP_CONFIG.name}
                                    </motion.span>
                                )}
                            </button>
                            {/* Mobile close */}
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="ml-auto lg:hidden h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary/80 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                            {NAV_ITEMS.map((item) => {
                                const isActive = location.pathname === item.to ||
                                    (item.to === "/network" && location.pathname.startsWith("/network")) ||
                                    (item.to === "/python" && location.pathname.startsWith("/python"));
                                const isSpecial = 'special' in item && item.special;

                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                                            collapsed && "justify-center px-0"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />

                                        {/* Special Peer Connect label with live badges */}
                                        {!collapsed && isSpecial ? (
                                            <div className="flex flex-1 items-center justify-between min-w-0">
                                                <span className="whitespace-nowrap">{item.label}</span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-[9px] font-semibold">
                                                        <Flame className="h-2.5 w-2.5" />{PEER_ONLINE_COUNT}
                                                    </span>
                                                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-[9px] font-semibold">
                                                        <Zap className="h-2.5 w-2.5" />{PEER_AI_MATCHES}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : !collapsed ? (
                                            <span className="whitespace-nowrap">{item.label}</span>
                                        ) : null}

                                        {/* Collapsed tooltip */}
                                        {collapsed && (
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                                {isSpecial
                                                    ? <>
                                                        {item.label}
                                                        <span className="ml-1.5 text-orange-400">🔥{PEER_ONLINE_COUNT}</span>
                                                        <span className="ml-1 text-violet-400">⚡{PEER_AI_MATCHES}</span>
                                                    </>
                                                    : item.label
                                                }
                                            </div>
                                        )}

                                        {/* Hover preview card for Peer Connect (non-collapsed) */}
                                        {!collapsed && isSpecial && (
                                            <div className="absolute left-full ml-3 top-0 w-52 p-3 bg-popover border border-border/50 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 space-y-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                                    <span className="text-xs font-medium">{PEER_ONLINE_COUNT} peers online</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground space-y-1">
                                                    <div>⚡ {PEER_AI_MATCHES} high match peers found</div>
                                                    <div>🤝 1 squad invite pending</div>
                                                </div>
                                            </div>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </nav>

                        {/* User section */}
                        <div className={cn(
                            "border-t border-border/30 p-3 shrink-0 flex items-center justify-center",
                            collapsed && "flex-col"
                        )}>
                            <div className={cn(
                                "flex items-center gap-3 w-full",
                                collapsed && "justify-center"
                            )}>
                                <UserButton appearance={{ elements: { rootBox: "shrink-0" } }} />
                                {!collapsed && user && (
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{user.fullName || user.firstName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Collapse toggle (desktop only) */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 rounded-full border border-border/50 bg-background items-center justify-center hover:bg-secondary transition-colors shadow-sm z-50"
                        >
                            {collapsed ? (
                                <ChevronRight className="h-3 w-3" />
                            ) : (
                                <ChevronLeft className="h-3 w-3" />
                            )}
                        </button>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                        {/* Top bar for mobile */}
                        <div className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                            >
                                <Menu className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <GraduationCap className="h-3.5 w-3.5 text-primary-foreground" />
                                </div>
                                <span className="text-sm font-display font-bold">{APP_CONFIG.name}</span>
                            </div>
                            <div className="ml-auto">
                                <UserButton />
                            </div>
                        </div>

                        {/* Page content */}
                        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                            <Outlet />
                        </div>
                    </main>

                    {/* AI Chat Widget */}
                    <AIChatWidget />
                </div>
            </MomentumProvider>
        </OpportunityProvider>
    );
}

