import { PlannerInput, StudyPlan } from '../features/study-planner/types';
import { api } from '@/lib/api';
import { addDays, differenceInDays, format, isBefore, startOfDay } from 'date-fns';

class StudyPlannerService {
  /**
   * Generates a study plan using the Groq AI endpoint.
   */
  async generateStudyPlan(input: PlannerInput): Promise<StudyPlan> {
    const today = startOfDay(new Date());
    const examDate = startOfDay(new Date(input.examDate));

    if (isBefore(examDate, today)) {
      throw new Error("Exam date cannot be in the past.");
    }
    if (!input.subjects || input.subjects.length === 0) {
      throw new Error("Please specify at least one subject.");
    }
    if (input.dailyHours > 12) {
      throw new Error("Daily hours cannot exceed 12 hours. Please maintain a healthy schedule.");
    }

    try {
      // Call explicitly configured new backend endpoint
      const response = await api.post('/ai/study-planner/generate', input);
      return response as unknown as StudyPlan;
    } catch (error) {
      console.error("AI Generation failed:", error);
      throw new Error("Failed to generate plan via AI. Please try again or check backend connection.");
    }
  }
}

export const studyPlannerService = new StudyPlannerService();
