import { motion } from "framer-motion";
import { Calendar, Target, CheckCircle2 } from "lucide-react";
import { StudyPlan } from "../types";

interface PlanResultProps {
  plan: StudyPlan;
}

export function PlanResult({ plan }: PlanResultProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Weekly Goals */}
        <div className="glass-card p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-foreground">Key Milestones</h3>
          </div>
          <ul className="space-y-2">
            {plan.weeklyGoals.map((goal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Focus Areas */}
        <div className="glass-card p-5 rounded-xl border border-purple-500/20 bg-purple-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold text-foreground">Focus Areas</h3>
          </div>
          <ul className="space-y-2">
            {plan.focusAreas.map((focus, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <span>{focus}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Daily Plan Timeline */}
      <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-secondary/20">
          <h3 className="font-semibold text-foreground">Daily Schedule Breakdown</h3>
        </div>
        <div className="p-0">
          {plan.dailyPlan.map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 flex gap-4 ${
                idx !== plan.dailyPlan.length - 1 ? "border-b border-border/40" : ""
              } hover:bg-secondary/10 transition-colors`}
            >
              <div className="w-24 shrink-0 text-center">
                <div className="text-2xl font-bold text-foreground">Day {day.day}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">{day.date}</div>
              </div>
              <div className="w-0.5 bg-border/50 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground">
                    {day.hours} Hours
                  </span>
                </div>
                <div className="space-y-1">
                  {day.topics.map((topic, i) => (
                    <div key={topic.taskId} className="text-sm text-foreground flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary/50 shrink-0" />
                      {topic.title}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


