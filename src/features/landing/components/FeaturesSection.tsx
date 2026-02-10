/**
 * FeaturesSection — landing page features grid.
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
          <span className="text-sm text-primary font-medium tracking-widest uppercase">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mt-4 mb-4">
            Everything you need to{" "}
            <span className="gradient-text">succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built by students, for students. Every feature designed to reduce
            placement stress.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card-hover rounded-2xl p-8 group cursor-default"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5`}
              >
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
