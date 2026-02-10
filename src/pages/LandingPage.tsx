import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, ArrowRight, Target, CalendarCheck, 
  CheckCircle2, BarChart3, Sparkles, Shield,
  Clock, TrendingUp, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

const features = [
  {
    icon: Target,
    title: "Track Every Opportunity",
    description: "Never miss a deadline again. See all companies, roles, and deadlines in one place.",
    gradient: "from-primary to-info",
  },
  {
    icon: BarChart3,
    title: "Visual Progress",
    description: "Monitor your application pipeline from wishlist to offer with beautiful status tracking.",
    gradient: "from-accent to-primary",
  },
  {
    icon: CalendarCheck,
    title: "Smart Deadlines",
    description: "Urgency-based alerts so you always know what needs attention right now.",
    gradient: "from-warning to-destructive",
  },
  {
    icon: CheckCircle2,
    title: "Prep Checklists",
    description: "Attach preparation tasks to each opportunity. Stay organized, stay prepared.",
    gradient: "from-success to-primary",
  },
];

const stats = [
  { value: "10K+", label: "Students Tracking", icon: Users },
  { value: "500+", label: "Companies Listed", icon: TrendingUp },
  { value: "98%", label: "Deadline Hit Rate", icon: Clock },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">PlaceTrack</span>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-primary to-info text-primary-foreground border-0 hover:opacity-90 transition-opacity"
          >
            Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-radial-accent" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-info/5 rounded-full blur-[150px] animate-float" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            Your Placement Companion
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.9] mb-6 text-balance"
          >
            Never Miss a{" "}
            <span className="gradient-text">Dream</span>
            <br />
            <span className="gradient-text-accent">Opportunity</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
          >
            Stop tracking placements across notebooks, screenshots, and WhatsApp groups.
            One smart dashboard to track, prepare, and land your dream role.
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
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-info text-primary-foreground border-0 hover:opacity-90 glow-primary transition-all hover:scale-105"
            >
              Start Tracking <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See Features
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-display font-bold gradient-text">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm text-primary font-medium tracking-widest uppercase">Features</span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold mt-4 mb-4">
              Everything you need to{" "}
              <span className="gradient-text">succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built by students, for students. Every feature designed to reduce placement stress.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card-hover rounded-2xl p-8 group cursor-default"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Mockup */}
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
                <img src={heroBg} alt="Dashboard preview" className="w-full h-auto opacity-80" />
                {/* Overlay with mockup text */}
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                      Your <span className="gradient-text">Command Center</span>
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      A beautiful dashboard that shows everything at a glance
                    </p>
                    <Button
                      size="lg"
                      onClick={() => navigate("/dashboard")}
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

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-6xl font-display font-bold mb-6 text-balance">
            Your future is <span className="gradient-text-accent">one click</span> away
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of students who stopped missing deadlines and started landing offers.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="text-lg px-10 py-6 bg-gradient-to-r from-accent to-primary text-primary-foreground border-0 hover:opacity-90 glow-accent transition-all hover:scale-105"
          >
            Get Started Free <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold">PlaceTrack</span>
          </div>
          <p className="text-sm text-muted-foreground">Built with 💚 for students</p>
        </div>
      </footer>
    </div>
  );
}
