/**
 * AppHeader — SecuraAI top navigation bar.
 * Landing page: premium glassmorphism navbar with animated logo, nav indicators,
 *               glowing CTA, and smooth mobile drawer.
 * Other pages: compact header with back button.
 */

import { useState, useEffect } from "react";
import { Brain, ArrowLeft, Search, Menu, X, Sparkles, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Features", href: "#features", icon: "⚡" },
  { label: "How It Works", href: "#how-it-works", icon: "🗺️" },
  { label: "AI Engine", href: "#solution", icon: "🧠" },
  { label: "Testimonials", href: "#testimonials", icon: "💬" },
];

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuth = location.pathname === "/auth";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (href: string, label: string) => {
    setMobileOpen(false);
    setActiveLink(label);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  /* ── Landing Page Navbar ──────────────────────────────────────── */
  if (isHome) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50"
        style={{
          backdropFilter: "blur(24px) saturate(2)",
          WebkitBackdropFilter: "blur(24px) saturate(2)",
          background: scrolled
            ? "rgba(5,8,24,0.97)"
            : "rgba(5,8,24,0.6)",
          borderBottom: scrolled
            ? "1px solid rgba(0,212,255,0.1)"
            : "1px solid rgba(255,255,255,0.05)",
          transition: "all 0.35s ease",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Top accent line */}
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0 h-[1.5px] origin-left"
            style={{ background: "linear-gradient(90deg, #00d4ff, #7c3aed, #00d4ff)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }}
          />
        )}

        <div className="max-w-[1380px] mx-auto px-6 flex items-center justify-between h-[60px] gap-4">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 group"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated logo icon */}
            <div className="relative h-9 w-9 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", boxShadow: "0 0 20px rgba(0,212,255,0.45)" }}>
              <Brain className="h-[18px] w-[18px] relative z-10" style={{ color: "#020617" }} />
              {/* Shimmer sweep */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", width: "60%" }}
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors duration-200">
                SecuraAI
              </span>
              <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: "#00d4ff", opacity: 0.7 }}>
                Career Platform
              </span>
            </div>
          </motion.div>

          {/* ── Desktop nav ────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => handleNav(link.href, link.label)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                whileHover={{ y: -1 }}
                className="relative px-4 py-2 text-sm font-medium rounded-lg group transition-all duration-200"
                style={{
                  color: activeLink === link.label ? "#00d4ff" : "#94a3b8",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <span className="relative z-10 flex items-center gap-1.5 group-hover:text-white transition-colors duration-150">
                  {link.label}
                </span>
                {/* Hover pill background */}
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "rgba(255,255,255,0.05)" }} />
                {/* Active underline */}
                <motion.span
                  className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full"
                  initial={false}
                  animate={{ scaleX: activeLink === link.label ? 1 : 0 }}
                  style={{ background: "linear-gradient(90deg,#00d4ff,#7c3aed)", transformOrigin: "left" }}
                />
                {/* Hover underline */}
                <span className="absolute bottom-0 left-3 right-3 h-[1px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  style={{ background: "#00d4ff40" }} />
              </motion.button>
            ))}
          </nav>

          {/* ── Right controls ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Search pill */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div key="open"
                  initial={{ width: 36, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 36, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(0,212,255,0.2)" }}
                >
                  <Search className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#00d4ff" }} />
                  <input autoFocus type="text" placeholder="Search…" value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    onBlur={() => { setSearchOpen(false); setSearchVal(""); }}
                    className="bg-transparent outline-none text-xs flex-1 min-w-0"
                    style={{ color: "#fff", fontFamily: "inherit" }} />
                  <button onClick={() => setSearchOpen(false)}><X className="h-3 w-3" style={{ color: "#64748b" }} /></button>
                </motion.div>
              ) : (
                <motion.button key="closed"
                  onClick={() => setSearchOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Search className="h-3.5 w-3.5" style={{ color: "#64748b" }} />
                </motion.button>
              )}
            </AnimatePresence>

            <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
            <SignedOut>
              <button onClick={() => navigate(APP_CONFIG.routes.auth)}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Login
              </button>

              {/* Glowing CTA button */}
              <motion.button
                onClick={() => navigate(APP_CONFIG.routes.auth)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,#00d4ff,#7c3aed)",
                  color: "#020617",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(124,58,237,0.2)",
                }}
              >
                {/* Shimmer */}
                <motion.span
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", width: "50%" }}
                />
                <Sparkles className="h-3.5 w-3.5 relative z-10" />
                <span className="relative z-10">Get Started</span>
              </motion.button>
            </SignedOut>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="lg:hidden p-2.5 rounded-xl flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.93 }}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>

        {/* ── Mobile drawer ──────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
              style={{ background: "rgba(5,8,24,0.99)", borderTop: "1px solid rgba(0,212,255,0.08)" }}
            >
              <div className="px-6 py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    onClick={() => handleNav(link.href, link.label)}
                    className="text-left text-sm font-medium py-3 px-3 rounded-xl flex items-center gap-3 transition-all group"
                    style={{
                      color: "#94a3b8",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="group-hover:text-white transition-colors">{link.label}</span>
                  </motion.button>
                ))}
                <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-3">
                  <SignedOut>
                    <motion.button
                      onClick={() => navigate(APP_CONFIG.routes.auth)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 }}
                      className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl"
                      style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", color: "#020617", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 24px rgba(0,212,255,0.35)" }}
                    >
                      <Zap className="h-4 w-4" /> Get Started Free
                    </motion.button>
                    <button onClick={() => navigate(APP_CONFIG.routes.auth)}
                      className="w-full text-sm font-medium py-2.5 rounded-xl"
                      style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "inherit" }}>
                      Login
                    </button>
                  </SignedOut>
                  <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    );
  }

  /* ── Standard Header (non-landing pages) ──────────────────────── */
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(5,8,24,0.95)",
        borderBottom: "1px solid rgba(0,212,255,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isAuth && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="h-9 w-9 rounded-xl flex items-center justify-center mr-1"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          )}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", boxShadow: "0 0 16px rgba(0,212,255,0.3)" }}>
              <Brain className="h-[18px] w-[18px]" style={{ color: "#020617" }} />
            </div>
            <div>
              <h1 className="text-[17px] font-black tracking-tight text-white">SecuraAI</h1>
              {!isAuth && <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#00d4ff", opacity: 0.7 }}>Career Platform</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
          <SignedOut>
            {!isAuth && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(APP_CONFIG.routes.auth)}
                className="text-sm font-bold px-5 py-2 rounded-xl flex items-center gap-1.5"
                style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", color: "#020617", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 16px rgba(0,212,255,0.3)" }}
              >
                <Sparkles className="h-3.5 w-3.5" /> Sign In
              </motion.button>
            )}
          </SignedOut>
        </div>
      </div>
    </motion.header>
  );
}
