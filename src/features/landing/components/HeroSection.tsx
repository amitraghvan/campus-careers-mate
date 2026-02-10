/**
 * HeroSection — landing page hero with interactive animations.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Shield, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config";
import { fadeUp } from "@/constants";
import { STATS } from "@/features/landing/constants/landing.constants";

const TYPING_WORDS = ["Dream Role", "First Offer", "Placement Season", "Career Goals"];

function useTypewriter(words: string[], speed = 100, pause = 2000) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pause);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [text, wordIndex, isDeleting, words, speed, pause]);

  return text;
}

function AnimatedCounter({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-display font-bold gradient-text">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export function HeroSection() {
  const navigate = useNavigate();
  const typewriterText = useTypewriter(TYPING_WORDS, 80, 2500);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 bg-radial-accent" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-info/5 rounded-full blur-[150px] animate-float" />

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="hidden lg:flex absolute top-1/3 left-8 xl:left-16 items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-sm"
      >
        <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
          <Trophy className="h-4 w-4 text-success" />
        </div>
        <div>
          <p className="font-semibold text-xs">3 Offers!</p>
          <p className="text-[10px] text-muted-foreground">This season</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="hidden lg:flex absolute top-1/2 right-8 xl:right-16 items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-sm"
      >
        <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center">
          <Zap className="h-4 w-4 text-warning" />
        </div>
        <div>
          <p className="font-semibold text-xs">Deadline: 2 days</p>
          <p className="text-[10px] text-muted-foreground">Google SDE</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.8 }}
        className="hidden lg:flex absolute bottom-1/3 left-12 xl:left-24 items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-sm"
      >
        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-xs">100% Secure</p>
          <p className="text-[10px] text-muted-foreground">Your data, your control</p>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8"
        >
          <Sparkles className="h-4 w-4" />
          <span>Your Placement Companion — Built for Campus Hustlers</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.9] mb-6 text-balance"
        >
          Crush Your{" "}
          <br className="sm:hidden" />
          <span className="gradient-text relative">
            {typewriterText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-[3px] h-[0.85em] bg-primary ml-0.5 align-middle"
            />
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
        >
          Stop juggling spreadsheets, WhatsApp screenshots, and sticky notes.
          <br className="hidden sm:block" />
          <strong className="text-foreground">One powerful dashboard</strong> to track every opportunity,
          nail every deadline, and land the offer you deserve.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => navigate(APP_CONFIG.routes.auth)}
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-info text-primary-foreground border-0 hover:opacity-90 glow-primary transition-all hover:scale-105 group"
          >
            Start Tracking Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={() => {
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See Features ↓
          </Button>
        </motion.div>

        {/* Animated stats */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          <AnimatedCounter target={10000} label="Students Tracking" suffix="+" />
          <AnimatedCounter target={500} label="Companies Listed" suffix="+" />
          <AnimatedCounter target={98} label="Deadline Hit Rate" suffix="%" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
