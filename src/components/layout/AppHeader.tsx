/**
 * AppHeader — shared top navigation bar used across all pages.
 */

import { GraduationCap, ArrowLeft, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config";
import { useAuth } from "@/features/auth/hooks";

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, signOut } = useAuth();
  const isHome = location.pathname === "/";
  const isAuth = location.pathname === "/auth";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isHome && !isAuth && (
            <button
              onClick={() => navigate("/")}
              className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors mr-1"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight">
                {APP_CONFIG.name}
              </h1>
              {!isHome && !isAuth && (
                <p className="text-xs text-muted-foreground">
                  Your placement command center
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/30">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {user.name}
                </span>
              </div>
              {/* Sign out */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              {!isAuth && (
                <Button
                  onClick={() => navigate(APP_CONFIG.routes.auth)}
                  className="bg-gradient-to-r from-primary to-info text-primary-foreground border-0 hover:opacity-90 transition-opacity"
                >
                  {isHome ? "Get Started" : "Sign In"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
