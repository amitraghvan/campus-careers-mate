/**
 * DashboardLayout — persistent sidebar + main content area.
 * Wraps all protected pages with a consistent navigation sidebar.
 */

import { useState } from "react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Workflow,
    BarChart3,
    CalendarDays,
    StickyNote,
    User,
    GraduationCap,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";
import { APP_CONFIG } from "@/config";
import { cn } from "@/lib/utils";
import { OpportunityProvider } from "@/features/opportunities/contexts/OpportunityContext";

const NAV_ITEMS = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/pipeline", icon: Workflow, label: "Pipeline" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/calendar", icon: CalendarDays, label: "Calendar" },
    { to: "/notes", icon: StickyNote, label: "Notes" },
    { to: "/profile", icon: User, label: "Profile" },
];

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <OpportunityProvider>
            <div className="min-h-screen bg-background flex">
                {/* Mobile overlay */}
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
                            const isActive = location.pathname === item.to;
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
                                    {!collapsed && (
                                        <span className="whitespace-nowrap">{item.label}</span>
                                    )}
                                    {collapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className={cn(
                        "border-t border-border/30 p-3 shrink-0",
                        collapsed && "flex flex-col items-center"
                    )}>
                        {!collapsed && user && (
                            <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            className={cn(
                                "text-muted-foreground hover:text-destructive w-full justify-start gap-2",
                                collapsed && "justify-center px-0 w-auto"
                            )}
                        >
                            <LogOut className="h-4 w-4" />
                            {!collapsed && <span>Sign Out</span>}
                        </Button>
                    </div>

                    {/* Collapse toggle (desktop only) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 rounded-full border border-border/50 bg-background items-center justify-center hover:bg-secondary transition-colors shadow-sm"
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
                    </div>

                    {/* Page content */}
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* AI Chat Widget */}
                <AIChatWidget />
            </div>
        </OpportunityProvider>
    );
}

