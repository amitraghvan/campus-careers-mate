/**
 * CTASection — final call-to-action on landing page.
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl sm:text-6xl font-display font-bold mb-6 text-balance">
          Your future is{" "}
          <span className="gradient-text-accent">one click</span> away
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join thousands of students who stopped missing deadlines and started
          landing offers.
        </p>
        <Button
          size="lg"
          onClick={() => navigate(APP_CONFIG.routes.auth)}
          className="text-lg px-10 py-6 bg-gradient-to-r from-accent to-primary text-primary-foreground border-0 hover:opacity-90 glow-accent transition-all hover:scale-105"
        >
          Get Started Free <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </section>
  );
}
