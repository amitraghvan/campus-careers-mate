/**
 * FeaturesSection — SecuraAI Complete Placement Platform.
 * Sections:
 * 1. Career Platform Features (7 cards)
 * 2. Career Command Center Dashboard Preview
 * 3. Smart Preparation
 * 4. Student Benefits
 * 5. Stats
 * 6. Testimonials
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/config";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CAREER_FEATURES = [
  {
    icon: "🎯",
    title: "Opportunity Tracker",
    desc: "Track all job opportunities, companies, and application stages in one unified place.",
    color: "from-cyan-500/15 to-blue-600/8",
    glow: "#00d4ff",
    border: "rgba(0,212,255,0.18)",
  },
  {
    icon: "⏰",
    title: "Deadline Manager",
    desc: "Never miss an application deadline with AI-powered smart reminders and calendar sync.",
    color: "from-purple-500/15 to-violet-600/8",
    glow: "#a855f7",
    border: "rgba(168,85,247,0.18)",
  },
  {
    icon: "📄",
    title: "Resume Builder",
    desc: "Generate and optimize your resume using AI-powered suggestions tailored to each job role.",
    color: "from-emerald-500/15 to-teal-600/8",
    glow: "#10b981",
    border: "rgba(16,185,129,0.18)",
  },
  {
    icon: "🤝",
    title: "Peer Connect",
    desc: "Connect with other students preparing for the same companies and exchange insights.",
    color: "from-amber-500/15 to-orange-600/8",
    glow: "#f59e0b",
    border: "rgba(245,158,11,0.18)",
  },
  {
    icon: "🔍",
    title: "Job Opportunity Discovery",
    desc: "Explore personalized job roles and companies based on your skills, interests, and career goals.",
    color: "from-rose-500/15 to-pink-600/8",
    glow: "#f43f5e",
    border: "rgba(244,63,94,0.18)",
  },
  {
    icon: "📋",
    title: "Application Pipeline",
    desc: "Track your full journey: Wishlist → Applied → Interview → Offer — all in one smart board.",
    color: "from-indigo-500/15 to-blue-600/8",
    glow: "#6366f1",
    border: "rgba(99,102,241,0.18)",
  },
  {
    icon: "📈",
    title: "Analytics Dashboard",
    desc: "Monitor your preparation progress, application success rate, and readiness score in real time.",
    color: "from-cyan-500/15 to-purple-600/8",
    glow: "#00d4ff",
    border: "rgba(0,212,255,0.18)",
  },
];

const PREP_ITEMS = [
  { icon: "🤖", title: "AI Resume Feedback", desc: "Get instant AI suggestions to improve your resume for specific roles." },
  { icon: "🎤", title: "Interview Preparation", desc: "Practice with AI-generated interview questions for your target companies." },
  { icon: "📅", title: "Daily Prep Goals", desc: "Stay on track with personalized daily preparation tasks and milestones." },
  { icon: "🔔", title: "Smart Reminders", desc: "AI sends timely study and application reminders based on your schedule." },
];

const BENEFITS = [
  { icon: "✅", title: "Stay Organized", desc: "All your opportunities, deadlines, and documents in one intelligent dashboard." },
  { icon: "⚡", title: "Never Miss Deadlines", desc: "Smart reminders ensure you never miss a critical application or interview window." },
  { icon: "🧠", title: "AI-Powered Guidance", desc: "Get personalized recommendations at every step of your placement journey." },
  { icon: "📊", title: "Track Your Progress", desc: "See your success rate, interview conversions, and preparation score evolve daily." },
];

const TESTIMONIALS = [
  {
    img: "https://i.pravatar.cc/150?u=10",
    name: "Aarav Singh",
    role: "B.Tech CSE at LPU",
    text: "PlaceTrack completely changed how I prep. The AI Resume Analyzer helped me clear the ATS for my dream internship. Honestly, lifesaver.",
    active: false,
  },
  {
    img: "https://i.pravatar.cc/150?u=11",
    name: "Neha Reddy",
    role: "Placed at TCS | LPU Alumni",
    text: "Tracking 50+ applications used to be a mess in Excel. The opportunity tracker combined with the AI mock exams got me placed way faster.",
    active: true,
  },
  {
    img: "https://i.pravatar.cc/150?u=12",
    name: "Rohan Kapoor",
    role: "Pre-Final Year, LPU",
    text: "The AI Code Explainer is insane. It's like having a senior dev sitting next to me during late-night competitive programming sessions.",
    active: false,
  },
];

const STATS = [
  { value: "50,000+", label: "Students Placed Successfully", color: "#00d4ff" },
  { value: "2M+", label: "Applications Tracked", color: "#a855f7" },
  { value: "92%", label: "Placement Success Rate", color: "#10b981" },
];

const PIPELINE_STAGES = [
  { label: "Wishlist", count: 24, color: "#94a3b8" },
  { label: "Applied", count: 14, color: "#00d4ff" },
  { label: "Interview", count: 6, color: "#a855f7" },
  { label: "Offer", count: 2, color: "#10b981" },
];

// ─── ANIMATION HELPER ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const BG = `
  radial-gradient(ellipse 120% 80% at 0% 30%,   rgba(0,212,255,0.07) 0%, transparent 50%),
  radial-gradient(ellipse 100% 80% at 100% 60%,  rgba(124,58,237,0.08) 0%, transparent 50%),
  radial-gradient(ellipse 80%  60% at 50% 100%,  rgba(0,80,255,0.06)  0%, transparent 50%),
  #050818
`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function FeaturesSection() {
  const navigate = useNavigate();

  return (
    <div style={{ background: BG, position: "relative" }} className="w-full overflow-hidden">
      {/* Shared dot-grid across ALL sections */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 0,
        backgroundImage: "radial-gradient(rgba(0,212,255,0.055) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — CAREER PLATFORM FEATURE CARDS
      ══════════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-28 px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.012) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

        <div className="relative max-w-[1200px] mx-auto z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}>
              ✦ Complete Platform
            </span>
            <h2 className="font-display font-black text-white leading-[1.05] mb-4"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}>
              Everything You Need To{" "}
              <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Land Your Dream Job
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              SecuraAI is a complete career command center — tracking opportunities, managing deadlines, and preparing you with AI at every step.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAREER_FEATURES.map((f, i) => (
              <motion.div key={i} {...fadeUp(0.06 * i)}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative rounded-2xl p-6 group cursor-default transition-all duration-300 bg-gradient-to-br ${f.color}`}
                style={{ border: `1px solid ${f.border}`, backdropFilter: "blur(12px)", boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `0 0 50px ${f.glow}30` }} />
                <span className="text-3xl mb-4 block" style={{ filter: `drop-shadow(0 0 10px ${f.glow}60)` }}>{f.icon}</span>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — CAREER COMMAND CENTER DASHBOARD PREVIEW
      ══════════════════════════════════════════════════════════ */}
      <section id="dashboard" className="relative py-28 px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)" }} />

        <div className="relative max-w-[1200px] mx-auto z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}>
              ✦ Dashboard Preview
            </span>
            <h2 className="font-display font-black text-white leading-[1.05] mb-4"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}>
              Your Career{" "}
              <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Command Center
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Track opportunities, monitor deadlines, manage applications, and stay organized — all in one intelligent dashboard.
            </p>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div {...fadeUp(0.15)}
            className="relative rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(0,212,255,0.12)", boxShadow: "0 0 80px rgba(0,212,255,0.08)" }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3"
              style={{ background: "rgba(10,15,30,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-4 text-xs text-slate-600 font-mono">app.securaai.com/dashboard</span>
            </div>

            {/* Dashboard body */}
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-[480px]"
              style={{ background: "rgba(8,11,20,0.98)" }}>

              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-1 p-4 border-r border-white/5">
                <div className="flex items-center gap-2 px-3 py-3 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-sm">🎓</div>
                  <span className="text-white font-semibold text-sm">SecuraAI</span>
                </div>
                {[
                  { icon: "📊", label: "Dashboard", active: true },
                  { icon: "🎯", label: "Opportunities", active: false },
                  { icon: "📋", label: "Applications", active: false },
                  { icon: "⏰", label: "Deadlines", active: false },
                  { icon: "📄", label: "Resume Builder", active: false },
                  { icon: "🤝", label: "Peer Connect", active: false },
                  { icon: "📈", label: "Analytics", active: false },
                ].map((item, i) => (
                  <div key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all"
                    style={{
                      background: item.active ? "rgba(0,212,255,0.1)" : "transparent",
                      color: item.active ? "#00d4ff" : "#64748b",
                      border: item.active ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
                    }}
                  >
                    <span>{item.icon}</span> {item.label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="p-5 flex flex-col gap-5">
                {/* Top stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Active Applications", value: "14", icon: "📋", color: "#00d4ff" },
                    { label: "Interview Scheduled", value: "3", icon: "🎤", color: "#a855f7" },
                    { label: "Deadlines This Week", value: "5", icon: "⏰", color: "#f59e0b" },
                    { label: "Offer Received", value: "1", icon: "🎉", color: "#10b981" },
                  ].map((stat, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                      className="rounded-xl p-4"
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${stat.color}1a` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">{stat.icon}</span>
                        <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: stat.color }}>{stat.label}</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Pipeline */}
                <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-semibold">Application Pipeline</p>
                  <div className="grid grid-cols-4 gap-3">
                    {PIPELINE_STAGES.map((stage, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-full rounded-lg p-3 flex flex-col items-center gap-1"
                          style={{ background: `${stage.color}12`, border: `1px solid ${stage.color}30` }}>
                          <span className="text-xl font-bold" style={{ color: stage.color }}>{stage.count}</span>
                          <span className="text-[9px] uppercase tracking-widest" style={{ color: stage.color }}>{stage.label}</span>
                        </div>
                        {i < PIPELINE_STAGES.length - 1 && (
                          <div className="hidden md:flex items-center justify-center w-full">
                            {/* arrow handled by grid spacing */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Upcoming deadlines */}
                  <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-semibold">Upcoming Deadlines</p>
                    <div className="flex flex-col gap-2.5">
                      {[
                        { company: "Google", role: "SDE-I", days: "2 days", color: "#f43f5e" },
                        { company: "Microsoft", role: "Product Intern", days: "5 days", color: "#f59e0b" },
                        { company: "Flipkart", role: "Data Analyst", days: "8 days", color: "#10b981" },
                      ].map((d, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-xs font-semibold">{d.company}</p>
                            <p className="text-slate-500 text-[10px]">{d.role}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}40` }}>
                            {d.days}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Readiness score */}
                  <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-semibold">Preparation Progress</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: "Resume Score", pct: 88, color: "#10b981" },
                        { label: "Interview Readiness", pct: 65, color: "#a855f7" },
                        { label: "Company Research", pct: 72, color: "#00d4ff" },
                      ].map((t, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">{t.label}</span>
                            <span className="font-semibold" style={{ color: t.color }}>{t.pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${t.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.15 * i }}
                              className="h-full rounded-full"
                              style={{ background: t.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — SMART PREPARATION
      ══════════════════════════════════════════════════════════ */}
      <section id="preparation" className="relative py-28 px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.05) 0%, transparent 70%)" }} />

        <div className="relative max-w-[1200px] mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Prep items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PREP_ITEMS.map((p, i) => (
                <motion.div key={i} {...fadeUp(0.08 * i)}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative rounded-2xl p-6 group cursor-default transition-all duration-300"
                  style={{ background: "rgba(15,20,35,0.7)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
                  <span className="text-3xl mb-4 block">{p.icon}</span>
                  <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Text */}
            <motion.div {...fadeUp(0.1)} className="flex flex-col gap-6">
              <span className="inline-block self-start text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
                ✦ AI Preparation
              </span>
              <h2 className="font-display font-black text-white leading-[1.05]"
                style={{ fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.03em" }}>
                Prepare Smarter{" "}
                <span style={{ background: "linear-gradient(135deg,#10b981,#00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  For Placements
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                SecuraAI doesn't just track your applications — it actively helps you prepare with AI-generated resume feedback, targeted interview practice, and daily study goals.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Personalized daily preparation checklist",
                  "AI feedback on your resume for each role",
                  "Practice questions for your target companies",
                  "Track preparation score across all companies",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="mt-0.5 text-emerald-400 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(APP_CONFIG.routes.auth)}
                className="self-start font-semibold text-sm py-3.5 px-8 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#10b981,#00d4ff)", color: "#050818", border: "none", boxShadow: "0 0 30px rgba(16,185,129,0.3)" }}
              >
                Start Preparing Free →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — STUDENT BENEFITS
      ══════════════════════════════════════════════════════════ */}
      <section id="benefits" className="relative py-28 px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.012) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

        <div className="relative max-w-[1200px] mx-auto z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}>
              ✦ Student Benefits
            </span>
            <h2 className="font-display font-black text-white leading-[1.05] mb-4"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}>
              Why Students{" "}
              <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Choose SecuraAI
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              The smartest students don't work harder — they work smarter with AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div key={i} {...fadeUp(0.08 * i)}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-2xl p-7 flex flex-col gap-4 group cursor-default transition-all duration-300 text-center items-center"
                style={{ background: "rgba(15,20,35,0.7)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
                <span className="text-4xl">{b.icon}</span>
                <h3 className="text-white font-bold text-base">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — STATS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/8 text-center">
          {STATS.map((s, i) => (
            <motion.div key={i} {...fadeUp(0.1 * i)} className="py-10 px-6 flex flex-col items-center gap-3">
              <span className="font-display font-black text-5xl md:text-6xl"
                style={{ background: `linear-gradient(135deg,${s.color},#fff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.value}
              </span>
              <p className="text-slate-400 text-base font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="relative py-28 px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />

        <div className="relative max-w-[1200px] mx-auto z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", color: "#a855f7" }}>
              ✦ Student Stories
            </span>
            <h2 className="font-display font-black text-white leading-[1.05]"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}>
              Loved by Students{" "}
              <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Worldwide
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp(0.1 * i)}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 group"
                style={t.active ? {
                  background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))",
                  border: "1px solid rgba(0,212,255,0.25)",
                  boxShadow: "0 0 60px rgba(0,212,255,0.08), 0 4px 40px rgba(0,0,0,0.4)",
                } : {
                  background: "rgba(15,20,35,0.7)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {t.active && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 h-[1px] w-2/3 pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)" }} />
                )}
                <p className="text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                    style={{ border: t.active ? "2px solid rgba(0,212,255,0.5)" : "2px solid rgba(255,255,255,0.1)" }} />
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                  {t.active && <span className="ml-auto text-yellow-400 text-base">★★★★★</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
