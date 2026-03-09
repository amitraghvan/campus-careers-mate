/**
 * CTASection — SecuraAI final call to action (placement platform focus).
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/config";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-36 px-6 overflow-hidden" style={{ background: "#050818" }}>
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,102,255,0.13) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.018) 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-3xl mx-auto text-center z-10"
      >
        <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-6 px-4 py-1.5 rounded-full"
          style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}>
          ✦ Your Career Starts Here
        </span>

        <h2 className="font-display font-black leading-[1.0] mb-5"
          style={{ fontSize: "clamp(2.5rem,6vw,5rem)", letterSpacing: "-0.03em" }}>
          Land Your Dream Job{" "}
          <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            With AI
          </span>
        </h2>

        <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "#94a3b8" }}>
          Join thousands of students using SecuraAI to track opportunities, prepare smarter, and ace their placements.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="cta-start"
            onClick={() => navigate(APP_CONFIG.routes.auth)}
            className="flex items-center gap-2 font-bold hover:opacity-90 hover:scale-105 transition-all group py-4 px-10 rounded-xl"
            style={{ background: "linear-gradient(135deg,#00d4ff,#0066ff)", color: "#020617", boxShadow: "0 8px 48px rgba(0,212,255,0.38)", fontSize: "1.05rem", border: "none" }}
          >
            Start For Free
            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          </button>
          <button
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="font-semibold py-4 px-10 rounded-xl transition-all hover:bg-white/5 hover:scale-105"
            style={{ background: "transparent", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)", fontSize: "1.05rem" }}
          >
            Explore Features
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10">
          {["No credit card required", "Free forever plan", "Setup in 2 minutes", "Built for placement prep"].map(p => (
            <span key={p} className="flex items-center gap-1.5 text-xs" style={{ color: "#475569" }}>
              <span style={{ color: "#00d4ff" }}>✓</span> {p}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
