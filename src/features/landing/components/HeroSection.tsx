/**
 * HeroSection — SecuraAI.
 * Slowly animated colour background using opacity + hue-rotate
 * (avoids broken gradient string interpolation in Framer Motion).
 */

import { motion } from "framer-motion";
import securaRobot from "@/assets/securai_robot.png";

// Each orb is a FIXED radial gradient — only opacity and scale animate.
// This is the reliable approach; Framer Motion can't interpolate gradient strings.
const ORBS = [
  { color: "#00d4ff", w: "65vw", h: "65vw", top: "-25%", left: "-15%", delay: 0, dur: 18 },
  { color: "#7c3aed", w: "55vw", h: "55vw", top: "-15%", left: "60%", delay: 3, dur: 22 },
  { color: "#10b981", w: "45vw", h: "45vw", top: "45%", left: "5%", delay: 6, dur: 28 },
  { color: "#f59e0b", w: "40vw", h: "40vw", top: "30%", left: "55%", delay: 9, dur: 20 },
  { color: "#f43f5e", w: "38vw", h: "38vw", top: "60%", left: "35%", delay: 12, dur: 24 },
];

export function HeroSection() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ background: "#050818", minHeight: "calc(100vh - 64px)" }}
    >
      {/* ── Colour orbs: fixed gradient, opacity-only animation ─── */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.w,
            height: orb.h,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color}22 0%, transparent 70%)`,
            filter: `blur(70px)`,
            zIndex: 0,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* ── Slowly hue-rotating top glow (pure CSS, reliable) ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(0,120,255,0.22) 0%, transparent 65%)",
          animation: "hueShift 30s linear infinite",
        }}
      />

      {/* Inject the hue-shift keyframe once */}
      <style>{`
        @keyframes hueShift {
          0%   { filter: hue-rotate(0deg)   brightness(1); }
          25%  { filter: hue-rotate(90deg)  brightness(1.05); }
          50%  { filter: hue-rotate(200deg) brightness(1); }
          75%  { filter: hue-rotate(300deg) brightness(1.05); }
          100% { filter: hue-rotate(360deg) brightness(1); }
        }
      `}</style>

      {/* ── Dot grid texture ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 0,
        backgroundImage: "radial-gradient(rgba(0,212,255,0.07) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 20%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 20%, transparent 100%)",
      }} />

      {/* ── Horizontal grid lines ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "100% 80px",
      }} />

      {/* ── Moving scan-line ──────────────────────────────────────── */}
      <motion.div
        animate={{ y: ["-100%", "120%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] pointer-events-none"
        style={{ zIndex: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.35), rgba(124,58,237,0.35), transparent)", opacity: 0.6 }}
      />

      {/* ── Bottom fade into next section ─────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none" style={{
        zIndex: 1,
        background: "linear-gradient(to bottom, transparent, #050818)"
      }} />

      {/* ── GIANT WATERMARK TEXT ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.08, x: "-50%", y: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[38%] left-1/2 pointer-events-none select-none whitespace-nowrap"
        style={{ zIndex: 0 }}
      >
        <h1
          className="font-black leading-none"
          style={{
            fontSize: "clamp(8rem, 28vw, 24rem)",
            letterSpacing: "-0.04em",
            fontFamily: "'Inter', sans-serif",
            color: "rgba(255,255,255,0.82)",
          }}
        >
          SecuraAI
        </h1>
      </motion.div>

      {/* ── ROBOT + CONTENT ───────────────────────────────────────── */}
      <div
        className="relative w-full max-w-[1400px] mx-auto px-8 flex flex-col items-center justify-center"
        style={{ zIndex: 2, paddingTop: "2rem" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center relative w-full pb-8"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
            style={{
              width: "clamp(300px, 42vw, 720px)",
              /* Radial mask fades all 4 edges → box invisible */
              maskImage: "radial-gradient(ellipse 85% 85% at 50% 42%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 42%, black 40%, transparent 100%)",
            }}
          >
            {/* Glow halo under robot, also hue-shifts */}
            <div
              className="absolute inset-x-[8%] bottom-0 h-[40%] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,212,255,0.28) 0%, rgba(124,58,237,0.12) 60%, transparent 100%)",
                filter: "blur(28px)",
                zIndex: -1,
                animation: "hueShift 20s linear infinite",
              }}
            />
            <img
              src={securaRobot}
              alt="SecuraAI Robot"
              className="w-full h-auto"
              style={{
                filter: "drop-shadow(0 0 50px rgba(0,212,255,0.5)) drop-shadow(0 0 100px rgba(124,58,237,0.25))",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
