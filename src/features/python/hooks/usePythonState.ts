/**
 * usePythonState Hook
 * Provides reactive access to Python progress, XP, streak, badges,
 * mastery levels, weak topics, and mutation handlers.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PythonProgressState, PythonBadge, TopicMastery } from '../types/python.types';
import { pythonStorage, INITIAL_BADGES } from '../services/python-storage.service';
import { PHASE_1_CHAPTERS, PHASE_1_ASSESSMENT } from '../data/python-phase1.data';

export function usePythonState() {
    const [state, setState] = useState<PythonProgressState>(() => pythonStorage.getState());

    useEffect(() => {
        const unsubscribe = pythonStorage.subscribe((newState) => {
            setState(newState);
        });
        return () => unsubscribe();
    }, []);

    // Derived Statistics
    const stats = useMemo(() => {
        // Total Lessons in Phase 1 (10 + 12 + 10 = 32)
        const totalLessons = PHASE_1_CHAPTERS.reduce((acc, c) => acc + c.lessons.length, 0);
        const completedLessonsCount = state.completedLessons.length;
        const lessonProgressPct = Math.round((completedLessonsCount / totalLessons) * 100);

        // Total Challenges in Phase 1 (5 + 7 + 8 = 20)
        const totalChallenges = PHASE_1_CHAPTERS.reduce((acc, c) => acc + c.challenges.length, 0);
        const completedChallengesCount = state.completedChallenges.length;
        const challengeProgressPct = Math.round((completedChallengesCount / totalChallenges) * 100);

        // Quizzes
        const totalQuizzes = PHASE_1_CHAPTERS.length; // 3
        const passedQuizzesCount = Object.values(state.quizScores).filter((s) => s >= 70).length;

        // Overall Phase 1 Completion Percentage
        // Weighted: 40% Lessons, 25% Challenges, 15% Quizzes, 10% Assessment, 10% Project
        const lessonWeight = (completedLessonsCount / totalLessons) * 40;
        const challengeWeight = (completedChallengesCount / totalChallenges) * 25;
        const quizWeight = (passedQuizzesCount / totalQuizzes) * 15;
        const assessmentWeight = state.assessmentResult?.passed ? 10 : 0;
        const projectWeight = state.projectCompleted ? 10 : 0;
        const overallPhaseProgressPct = Math.min(100, Math.round(lessonWeight + challengeWeight + quizWeight + assessmentWeight + projectWeight));

        // Mastery Score (Average of all topic mastery scores)
        const topicList = Object.values(state.topicMastery);
        const avgMastery = topicList.length > 0
            ? Math.round(topicList.reduce((acc, t) => acc + t.score, 0) / topicList.length)
            : 0;

        let masteryLevel: 'Beginner' | 'Learning' | 'Practicing' | 'Strong' | 'Mastered' = 'Beginner';
        if (avgMastery >= 96) masteryLevel = 'Mastered';
        else if (avgMastery >= 81) masteryLevel = 'Strong';
        else if (avgMastery >= 61) masteryLevel = 'Practicing';
        else if (avgMastery >= 31) masteryLevel = 'Learning';

        // Weak topics (< 70% with at least 1 attempt)
        const weakTopics = pythonStorage.getWeakTopics();

        return {
            totalLessons,
            completedLessonsCount,
            lessonProgressPct,
            totalChallenges,
            completedChallengesCount,
            challengeProgressPct,
            totalQuizzes,
            passedQuizzesCount,
            overallPhaseProgressPct,
            avgMastery,
            masteryLevel,
            weakTopics,
            unresolvedMistakesCount: state.mistakes.filter((m) => !m.resolved).length,
        };
    }, [state]);

    // Badges List with unlocked status
    const badgesWithStatus = useMemo(() => {
        return INITIAL_BADGES.map((b) => ({
            ...b,
            isUnlocked: state.unlockedBadges.includes(b.id),
        }));
    }, [state.unlockedBadges]);

    // Actions
    const completeLesson = useCallback((lessonId: string, chapterId: number, xpReward: number = 10) => {
        return pythonStorage.completeLesson(lessonId, chapterId, xpReward);
    }, []);

    const completeChallenge = useCallback((
        challengeId: string,
        chapterId: number,
        difficulty: string,
        topic: string,
        code: string
    ) => {
        return pythonStorage.completeChallenge(challengeId, chapterId, difficulty, topic, code);
    }, []);

    const recordQuizScore = useCallback((chapterId: number, scorePercentage: number, passed: boolean) => {
        return pythonStorage.recordQuizScore(chapterId, scorePercentage, passed);
    }, []);

    const recordAssessmentResult = useCallback((result: {
        score: number;
        totalPoints: number;
        percentage: number;
        passed: boolean;
        sectionScores: Record<string, number>;
        phaseId?: number;
    }) => {
        return pythonStorage.recordAssessmentResult(result);
    }, []);

    const completeProject = useCallback((param1: string, param2?: string, param3?: number) => {
        // Handle both completeProject(code) and completeProject(projectId, code, xpReward)
        if (param2 !== undefined) {
            return pythonStorage.completeProject(param1, param2, param3 ?? 150);
        } else {
            return pythonStorage.completeProject('p1-final-project', param1, 250);
        }
    }, []);

    const completeDailyChallenge = useCallback((dateStr: string, xpReward: number = 35) => {
        return pythonStorage.completeDailyChallenge(dateStr, xpReward);
    }, []);

    const logMistake = useCallback((mistake: Parameters<typeof pythonStorage.logMistake>[0]) => {
        return pythonStorage.logMistake(mistake);
    }, []);

    const resolveMistake = useCallback((mistakeId: string) => {
        return pythonStorage.resolveMistake(mistakeId);
    }, []);

    const recordHintUsage = useCallback((entityId: string, level: number) => {
        return pythonStorage.recordHintUsage(entityId, level);
    }, []);

    const saveCodeDraft = useCallback((entityId: string, code: string) => {
        return pythonStorage.saveCodeDraft(entityId, code);
    }, []);

    return {
        state,
        stats,
        badges: badgesWithStatus,
        completeLesson,
        completeChallenge,
        recordQuizScore,
        recordAssessmentResult,
        completeProject,
        completeDailyChallenge,
        logMistake,
        resolveMistake,
        recordHintUsage,
        saveCodeDraft,
    };
}
