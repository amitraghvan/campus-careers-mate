export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface PlannerInput {
  goal: string;
  subjects: string[];
  examDate: string; // ISO date string
  dailyHours: number;
  level: SkillLevel;
}

export interface StudyTask {
  taskId: string;
  title: string;
  completed: boolean;
}

export interface DailyPlanItem {
  day: number;
  date: string;       // ISO or human readable
  topics: StudyTask[];
  hours: number;
}

export interface StudyPlan {
  dailyPlan: DailyPlanItem[];
  weeklyGoals: string[];
  focusAreas: string[];
}
