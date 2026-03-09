/**
 * PreviewSection — SecuraAI.
 * "How SecuraAI Works" 4-Step Guide for placement platform.
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/config";

const STEPS = [
  {
    step: "01", title: "Create Your Profile",
    desc: "Set up your skills, target companies, expected graduation, and career goals.",
    icon: "👤", color: "#00d4ff"
  },
  {
    step: "02", title: "Track Opportunities",
    desc: "Discover job roles, save opportunities, and let SecuraAI notify you about deadlines.",
    icon: "🎯", color: "#a855f7"
  },
  {
    step: "03", title: "Prepare with AI",
    desc: "Get your resume reviewed, practice interview questions, and follow a daily prep plan.",
    icon: "🧠", color: "#10b981"
  },
  {
    step: "04", title: "Land Your Offer",
    desc: "Track every stage from application to offer — SecuraAI keeps you organized and confident.",
    icon: "🏆", color: "#f59e0b"
  },
];

export function PreviewSection() {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="relative py-28 px-6 overflow-hidden" style={{ background: "#050818" }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.012) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      <div className="relative max-w-[1160px] mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}>
            ✦ How It Works
          </span>
          <h2 className="font-display font-black text-white leading-[1.05] mb-4"
            style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}>
            From Student To{" "}
            <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Placed Professional
            </span>{" "}in 4 Steps
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            SecuraAI guides you through every stage of your placement journey.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-[52px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-[1px] z-0"
            style={{ background: "linear-gradient(90deg, #00d4ff44, #a855f744, #10b98144, #f59e0b44)" }} />

          {STEPS.map((step, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 * idx }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="relative z-10 flex flex-col items-center text-center group cursor-default"
            >
              {/* Icon circle */}
              <div className="w-[104px] h-[104px] rounded-2xl mb-6 flex flex-col items-center justify-center transition-all duration-300"
                style={{
                  background: `rgba(${step.color === "#00d4ff" ? "0,212,255" : step.color === "#a855f7" ? "168,85,247" : step.color === "#10b981" ? "16,185,129" : "245,158,11"},0.08)`,
                  border: `1px solid ${step.color}33`,
                  boxShadow: `0 0 30px ${step.color}18`,
                }}
              >
                <span className="text-3xl mb-1">{step.icon}</span>
                <span className="text-xs font-bold tracking-widest" style={{ color: step.color }}>STEP {step.step}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[220px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA below steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <button
            onClick={() => navigate(APP_CONFIG.routes.auth)}
            className="font-semibold text-sm py-3.5 px-10 rounded-xl transition-all hover:scale-105 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg,#00d4ff,#7c3aed)",
              color: "#050818",
              border: "none",
              boxShadow: "0 0 30px rgba(0,212,255,0.3)"
            }}
          >
            🚀 Start Your Placement Journey Free
          </button>
        </motion.div>
      </div>
    </section>
  );
}
