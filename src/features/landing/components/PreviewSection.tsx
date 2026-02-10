/**
 * PreviewSection — dashboard preview mockup on landing page.
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config";
import heroBg from "@/assets/hero-bg.jpg";

export function PreviewSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-info/20 rounded-3xl blur-2xl" />
          <div className="relative glass-card rounded-2xl p-1 overflow-hidden">
            <div className="rounded-xl overflow-hidden">
              <img
                src={heroBg}
                alt="Dashboard preview"
                className="w-full h-auto opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                    Your{" "}
                    <span className="gradient-text">Command Center</span>
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    A beautiful dashboard that shows everything at a glance
                  </p>
                  <Button
                    size="lg"
                    onClick={() => navigate(APP_CONFIG.routes.auth)}
                    className="bg-gradient-to-r from-primary to-info text-primary-foreground border-0 hover:opacity-90 glow-primary"
                  >
                    Try it now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
