/**
 * FeaturesSection — landing page features grid with interactive hover effects.
 */

import { motion } from "framer-motion";
import { FEATURES } from "@/features/landing/constants/landing.constants";

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-sm text-primary font-medium tracking-widest uppercase px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-4"
          >
            ✨ Powerful Features
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mt-4 mb-4">
            Everything you need to{" "}
            <span className="gradient-text">succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built by students, for students. Every feature crafted to eliminate
            placement stress and maximize your success.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-8 group cursor-default relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient}`}
                  >
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    Included ✓
                  </span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            And more coming soon — <span className="text-primary">Analytics</span>, <span className="text-accent">Calendar</span>, <span className="text-warning">Notes</span>, and <span className="text-success">Interview Prep</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
