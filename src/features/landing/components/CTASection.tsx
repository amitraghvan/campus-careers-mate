/**
 * CTASection — final call-to-action with interactive elements.
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config";

const TESTIMONIALS = [
  { name: "Priya S.", college: "IIT Delhi", text: "Landed 3 offers. PlaceTrack kept me organized!" },
  { name: "Rahul M.", college: "NIT Trichy", text: "Never missed a single deadline this season." },
  { name: "Sneha K.", college: "BITS Pilani", text: "The dashboard is a game changer 🔥" },
];

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />

      {/* Testimonials */}
      <div className="relative max-w-5xl mx-auto mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-widest"
        >
          Loved by students across India
        </motion.p>
        <div className="grid sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-xl p-5 text-center"
            >
              <div className="flex gap-0.5 justify-center mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-3 italic">"{t.text}"</p>
              <p className="text-xs font-semibold">{t.name}</p>
              <p className="text-[10px] text-muted-foreground">{t.college}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
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
          landing offers. It's free, forever.
        </p>
        <Button
          size="lg"
          onClick={() => navigate(APP_CONFIG.routes.auth)}
          className="text-lg px-10 py-6 bg-gradient-to-r from-accent to-primary text-primary-foreground border-0 hover:opacity-90 glow-accent transition-all hover:scale-105 group"
        >
          Get Started Free <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
        </Button>
        <p className="text-xs text-muted-foreground mt-4">No credit card required • Free forever • Built with ❤️ in India</p>
      </motion.div>
    </section>
  );
}

