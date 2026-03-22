import { motion } from "framer-motion";
import { Calendar, Target, CheckCircle2, Flame, Trophy, Divide as CheckCircleProps } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore";

export function PlanTracker() {
  const { activePlan: plan, completedTasks, toggleTask, streak, getProgress } = useStudyStore();

  if (!plan) return null;

  const { completed, total, percentage } = getProgress();

  return (
    <div className="space-y-6">
      {/* Top Progress & Streak Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Progress */}
        <div className="glass-card p-5 rounded-xl border border-border/50 md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Mastery Progress
            </h3>
            <span className="text-sm font-medium text-muted-foreground">{completed} / {total} Tasks</span>
          </div>
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-right mt-1 text-muted-foreground">{percentage}% Completed</div>
        </div>

        {/* Action Streak */}
        <div className="glass-card p-5 rounded-xl border border-orange-500/20 bg-orange-500/5 flex flex-col justify-center items-center">
          <div className="flex items-center gap-2">
            <Flame className={`h-8 w-8 ${streak > 0 ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'text-muted-foreground opacity-50'} transition-all`} />
            <div className="text-3xl font-bold font-display tracking-tight text-foreground">{streak}</div>
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Day Streak</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Weekly Goals */}
        <div className="glass-card p-5 rounded-xl border border-border/50 bg-card/20">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-foreground">Key Milestones</h3>
          </div>
          <ul className="space-y-2">
            {plan.weeklyGoals.map((goal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Focus Areas */}
        <div className="glass-card p-5 rounded-xl border border-border/50 bg-card/20">
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

      {/* Interactive Daily Plan Timeline */}
      <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-secondary/20 flex justify-between items-center">
          <h3 className="font-semibold text-foreground">Action Timeline</h3>
          <span className="text-xs text-muted-foreground">Check off items to build your streak</span>
        </div>
        <div className="p-0">
          {plan.dailyPlan.map((day, idx) => {
            // Calculate if all tasks for this day are done purely for visual flair
            const allDayTasksCompleted = day.topics.length > 0 && day.topics.every(t => completedTasks[t.taskId]);

            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 flex gap-4 ${
                  idx !== plan.dailyPlan.length - 1 ? "border-b border-border/40" : ""
                } transition-colors ${allDayTasksCompleted ? 'bg-green-500/5' : 'hover:bg-secondary/10'}`}
              >
                <div className="w-24 shrink-0 text-center">
                  <div className={`text-2xl font-bold transition-colors ${allDayTasksCompleted ? 'text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'text-foreground'}`}>
                    Day {day.day}
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">{day.date}</div>
                </div>
                
                <div className={`w-0.5 shrink-0 transition-colors ${allDayTasksCompleted ? 'bg-green-500/30' : 'bg-border/50'}`} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground">
                      {day.hours} Hours
                    </span>
                    {allDayTasksCompleted && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Day Complete
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {day.topics.map((topic) => {
                      const isComplete = !!completedTasks[topic.taskId];
                      return (
                        <div 
                          key={topic.taskId} 
                          className={`text-sm flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                            isComplete ? 'bg-secondary/50 text-muted-foreground' : 'hover:bg-secondary/30 text-foreground'
                          }`}
                          onClick={() => toggleTask(topic.taskId)}
                        >
                          {/* Custom Checkbox */}
                          <div className={`mt-0.5 shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                            isComplete 
                              ? 'bg-orange-500 border-orange-500 text-white' 
                              : 'bg-background border-border hover:border-orange-500'
                          }`}>
                            {isComplete && <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />}
                          </div>
                          
                          <span className={`${isComplete ? 'line-through decoration-muted-foreground/50' : ''} transition-all`}>
                            {topic.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
