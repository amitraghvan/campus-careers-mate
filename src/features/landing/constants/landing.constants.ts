/**
 * Landing page constants — feature cards, stats, etc.
 */

import {
  Target,
  CalendarCheck,
  CheckCircle2,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";

export const FEATURES = [
  {
    icon: Target,
    title: "Track Every Opportunity",
    description:
      "Never miss a deadline again. See all companies, roles, and deadlines in one place.",
    gradient: "from-primary to-info",
  },
  {
    icon: BarChart3,
    title: "Visual Progress",
    description:
      "Monitor your application pipeline from wishlist to offer with beautiful status tracking.",
    gradient: "from-accent to-primary",
  },
  {
    icon: CalendarCheck,
    title: "Smart Deadlines",
    description:
      "Urgency-based alerts so you always know what needs attention right now.",
    gradient: "from-warning to-destructive",
  },
  {
    icon: CheckCircle2,
    title: "Prep Checklists",
    description:
      "Attach preparation tasks to each opportunity. Stay organized, stay prepared.",
    gradient: "from-success to-primary",
  },
] as const;

export const STATS = [
  { value: "10K+", label: "Students Tracking", icon: Users },
  { value: "500+", label: "Companies Listed", icon: TrendingUp },
  { value: "98%", label: "Deadline Hit Rate", icon: Clock },
] as const;

