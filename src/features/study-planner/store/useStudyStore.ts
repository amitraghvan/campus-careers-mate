import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudyPlan } from '../types';
import { isToday, isYesterday, startOfDay, differenceInDays } from 'date-fns';

interface StudyState {
  // Current active plan
  activePlan: StudyPlan | null;
  // Map of taskId -> boolean
  completedTasks: Record<string, boolean>;
  
  // Custom uploaded plans cache (future use for switching)
  customPlans: StudyPlan[];

  // Streak tracking
  streak: number;
  lastCompletedDate: string | null;

  // Actions
  setPlan: (plan: StudyPlan) => void;
  toggleTask: (taskId: string) => void;
  addCustomPlan: (plan: StudyPlan) => void;
  clearPlan: () => void;
  
  // Getters (computed)
  getProgress: () => { completed: number; total: number; percentage: number };
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      activePlan: null,
      completedTasks: {},
      customPlans: [],
      streak: 0,
      lastCompletedDate: null,

      setPlan: (plan: StudyPlan) => {
        set({ activePlan: plan, completedTasks: {} });
      },

      toggleTask: (taskId: string) => {
        const { completedTasks, lastCompletedDate, streak } = get();
        const isCurrentlyCompleted = !!completedTasks[taskId];
        
        // Toggle the specific task
        const newCompletedTasks = {
          ...completedTasks,
          [taskId]: !isCurrentlyCompleted,
        };

        const stateUpdates: Partial<StudyState> = {
          completedTasks: newCompletedTasks,
        };

        // If we just completed a task, evaluate streak logic
        if (!isCurrentlyCompleted) {
          const today = startOfDay(new Date()).toISOString();
          
          if (!lastCompletedDate) {
            // First time ever completing a task
            stateUpdates.streak = 1;
            stateUpdates.lastCompletedDate = today;
          } else {
            const lastDate = new Date(lastCompletedDate);
            if (isYesterday(lastDate)) {
              // Streak continues!
              stateUpdates.streak = streak + 1;
              stateUpdates.lastCompletedDate = today;
            } else if (!isToday(lastDate)) {
              // We missed a day(s), streak resets
              stateUpdates.streak = 1;
              stateUpdates.lastCompletedDate = today;
            }
            // If isToday(lastDate) is true, we already completed a task today, streak remains same.
          }
        }

        set(stateUpdates);
      },

      addCustomPlan: (plan: StudyPlan) => {
        set((state) => ({ customPlans: [...state.customPlans, plan] }));
      },

      clearPlan: () => {
        set({ activePlan: null, completedTasks: {} });
      },

      getProgress: () => {
        const { activePlan, completedTasks } = get();
        if (!activePlan) return { completed: 0, total: 0, percentage: 0 };

        let total = 0;
        let completed = 0;

        activePlan.dailyPlan.forEach((day) => {
          day.topics.forEach((topic) => {
            total += 1;
            if (completedTasks[topic.taskId]) {
              completed += 1;
            }
          });
        });

        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { completed, total, percentage };
      },
    }),
    {
      name: 'study-planner-storage',
    }
  )
);
