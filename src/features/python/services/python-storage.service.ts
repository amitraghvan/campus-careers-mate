/**
 * Python Foundations State & Storage Service
 * Handles persistence, XP gamification, badges, streaks, mastery,
 * weak topic detection, mistake tracking, and multi-phase progression.
 */

import {
    PythonProgressState,
    PythonMistake,
    PythonBadge,
    TopicMastery
} from '../types/python.types';
import { storage } from '@/utils';

const STORAGE_KEY = 'placetrack_python_foundations_v1';

export const INITIAL_BADGES: PythonBadge[] = [
    // Phase 1 Badges
    {
        id: 'FIRST_STEP',
        title: 'First Python Step',
        description: 'Completed your first Python lesson.',
        icon: '🐍',
        xpValue: 20,
        category: 'milestone',
    },
    {
        id: 'HELLO_WORLD',
        title: 'Hello World Master',
        description: 'Successfully ran and modified your first Python program.',
        icon: '💻',
        xpValue: 30,
        category: 'chapter',
    },
    {
        id: 'VARIABLE_ROOKIE',
        title: 'Variable Rookie',
        description: 'Mastered variables, values, and data types in Chapter 2.',
        icon: '📦',
        xpValue: 100,
        category: 'chapter',
    },
    {
        id: 'OPERATOR_EXPLORER',
        title: 'Operator Explorer',
        description: 'Completed expressions, operators, and statements in Chapter 3.',
        icon: '⚙️',
        xpValue: 100,
        category: 'chapter',
    },
    {
        id: 'PYTHON_FOUNDATION',
        title: 'Python Foundation',
        description: 'Completed all Phase 1 chapters, assessment, and capstone project!',
        icon: '🧠',
        xpValue: 300,
        category: 'phase',
    },

    // Phase 2 Badges
    {
        id: 'DECISION_MAKER',
        title: 'Decision Maker',
        description: 'Mastered conditional statements, Boolean logic, and if-elif trees in Chapter 4.',
        icon: '🔀',
        xpValue: 100,
        category: 'chapter',
    },
    {
        id: 'RANDOM_EXPLORER',
        title: 'Random Explorer',
        description: 'Mastered random number generation, choice(), and game logic in Chapter 5.',
        icon: '🎲',
        xpValue: 100,
        category: 'chapter',
    },
    {
        id: 'LOOP_BEGINNER',
        title: 'Loop Beginner',
        description: 'Completed your first iterative loop challenge.',
        icon: '🔁',
        xpValue: 50,
        category: 'milestone',
    },
    {
        id: 'LOOP_WARRIOR',
        title: 'Loop Warrior',
        description: 'Mastered while loops, for loops, range(), and nested patterns in Chapter 6.',
        icon: '⚔️',
        xpValue: 100,
        category: 'chapter',
    },
    {
        id: 'LOGIC_BUILDER',
        title: 'Logic Builder',
        description: 'Passed the Phase 2 Control Flow & Iteration Comprehensive Assessment!',
        icon: '🧠',
        xpValue: 200,
        category: 'milestone',
    },
    {
        id: 'CONTROL_FLOW_MASTER',
        title: 'Control Flow Master',
        description: 'Completed all Phase 2 chapters, projects, and final assessment!',
        icon: '🏆',
        xpValue: 300,
        category: 'phase',
    },
];

const INITIAL_STATE: PythonProgressState = {
    xp: 0,
    currentStreak: 1,
    bestStreak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    freezeDaysRemaining: 2,
    streakHistory: [new Date().toISOString().split('T')[0]],
    completedLessons: [],
    completedChallenges: [],
    completedDailyChallenges: [],
    quizScores: {},
    projectCompleted: false,
    completedProjects: [],
    unlockedBadges: [],
    unlockedChapters: [1, 2, 3, 4, 5, 6],
    mistakes: [],
    topicMastery: {
        // Phase 1 Topics
        environment: { topic: 'environment', displayName: 'Environment & Setup', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        variables: { topic: 'variables', displayName: 'Variables & Assignment', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        types: { topic: 'types', displayName: 'Values & Data Types', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        expressions: { topic: 'expressions', displayName: 'Expressions & Statements', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        operators: { topic: 'operators', displayName: 'Operators & Precedence', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        strings: { topic: 'strings', displayName: 'String Operations', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        debugging: { topic: 'debugging', displayName: 'Debugging & Errors', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },

        // Phase 2 Topics
        conditions: { topic: 'conditions', displayName: 'Conditionals (if/else)', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        booleans: { topic: 'booleans', displayName: 'Boolean Logic & Truth Tables', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        random: { topic: 'random', displayName: 'Random Numbers & Simulations', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        while_loops: { topic: 'while_loops', displayName: 'while Loops', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        for_loops: { topic: 'for_loops', displayName: 'for Loops', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        range: { topic: 'range', displayName: 'range() Sequence Generator', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        nested_loops: { topic: 'nested_loops', displayName: 'Nested Loops & Grids', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        patterns: { topic: 'patterns', displayName: 'Pattern Printing', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        counters: { topic: 'counters', displayName: 'Loop Counters', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        accumulators: { topic: 'accumulators', displayName: 'Accumulators & Sums', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        encapsulation: { topic: 'encapsulation', displayName: 'Encapsulation Concept', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
        generalization: { topic: 'generalization', displayName: 'Generalization Concept', score: 0, level: 'Beginner', totalAttempts: 0, successfulAttempts: 0 },
    },
    usedHints: {},
    codeSubmissions: {},
};

type StateListener = (state: PythonProgressState) => void;

class PythonStorageService {
    private listeners: Set<StateListener> = new Set();

    public subscribe(listener: StateListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify(state: PythonProgressState) {
        this.listeners.forEach((listener) => listener(state));
    }

    public getState(): PythonProgressState {
        const stored = storage.get<PythonProgressState | null>(STORAGE_KEY, null);
        const today = new Date().toISOString().split('T')[0];

        if (!stored) {
            this.saveState(INITIAL_STATE);
            return INITIAL_STATE;
        }

        // Ensure all Phase 1 & Phase 2 chapters are unlocked
        if (!stored.unlockedChapters || stored.unlockedChapters.length < 6) {
            stored.unlockedChapters = [1, 2, 3, 4, 5, 6];
            this.saveState(stored);
        }

        if (!stored.completedProjects) {
            stored.completedProjects = stored.projectCompleted ? ['p1-final-project'] : [];
            this.saveState(stored);
        }

        // Process daily streak logic if visiting on a subsequent day
        if (stored.lastActiveDate !== today) {
            const updated = this.checkStreakUpdate(stored, today);
            this.saveState(updated);
            return updated;
        }

        return stored;
    }

    public saveState(state: PythonProgressState) {
        storage.set(STORAGE_KEY, state);
        this.notify(state);
    }

    private checkStreakUpdate(state: PythonProgressState, today: string): PythonProgressState {
        const lastDate = new Date(state.lastActiveDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let currentStreak = state.currentStreak;
        let freezeDaysRemaining = state.freezeDaysRemaining;

        if (diffDays === 1) {
            currentStreak += 1;
        } else if (diffDays === 2 && freezeDaysRemaining > 0) {
            freezeDaysRemaining -= 1;
            currentStreak += 1;
        } else if (diffDays > 1) {
            currentStreak = 1;
        }

        const bestStreak = Math.max(state.bestStreak, currentStreak);
        const streakHistory = state.streakHistory.includes(today)
            ? state.streakHistory
            : [...state.streakHistory, today];

        return {
            ...state,
            currentStreak,
            bestStreak,
            freezeDaysRemaining,
            lastActiveDate: today,
            streakHistory,
        };
    }

    public recordActivity(): PythonProgressState {
        const state = this.getState();
        const today = new Date().toISOString().split('T')[0];
        if (state.lastActiveDate !== today) {
            return this.checkStreakUpdate(state, today);
        }
        return state;
    }

    public addXP(amount: number): PythonProgressState {
        const state = this.getState();
        const updated = { ...state, xp: state.xp + amount };
        this.saveState(updated);
        return updated;
    }

    public unlockBadge(badgeId: string): { state: PythonProgressState; newlyUnlocked: boolean } {
        const state = this.getState();
        if (state.unlockedBadges.includes(badgeId)) {
            return { state, newlyUnlocked: false };
        }

        const badge = INITIAL_BADGES.find((b) => b.id === badgeId);
        const xpToAdd = badge ? badge.xpValue : 0;

        const updated: PythonProgressState = {
            ...state,
            unlockedBadges: [...state.unlockedBadges, badgeId],
            xp: state.xp + xpToAdd,
        };

        this.saveState(updated);
        return { state: updated, newlyUnlocked: true };
    }

    public completeLesson(lessonId: string, chapterId: number, xpReward: number = 10): PythonProgressState {
        let state = this.getState();
        state = this.recordActivity();

        if (!state.completedLessons.includes(lessonId)) {
            state.completedLessons.push(lessonId);
            state.xp += xpReward;

            // Check badge: FIRST_STEP
            if (!state.unlockedBadges.includes('FIRST_STEP')) {
                state.unlockedBadges.push('FIRST_STEP');
                state.xp += 20;
            }

            // Check badge: HELLO_WORLD if lesson 10 in chapter 1 completed
            if (lessonId === 'p1-c1-l10' || lessonId.includes('hello')) {
                if (!state.unlockedBadges.includes('HELLO_WORLD')) {
                    state.unlockedBadges.push('HELLO_WORLD');
                    state.xp += 30;
                }
            }

            const topicKey = chapterId >= 4 ? (chapterId === 4 ? 'conditions' : chapterId === 5 ? 'random' : 'for_loops') : 'environment';
            this.updateTopicMasteryForEntity(state, topicKey, true);
            this.saveState(state);
        }

        return state;
    }

    public completeChallenge(
        challengeId: string,
        chapterId: number,
        difficulty: string,
        topic: string,
        code: string
    ): PythonProgressState {
        let state = this.getState();
        state = this.recordActivity();

        let xpBonus = 20;
        if (difficulty === 'Medium') xpBonus = 35;
        if (difficulty === 'Hard') xpBonus = 50;

        if (!state.completedChallenges.includes(challengeId)) {
            state.completedChallenges.push(challengeId);
            state.xp += xpBonus;

            // Check badge: LOOP_BEGINNER on first chapter 6 challenge
            if (chapterId === 6 && !state.unlockedBadges.includes('LOOP_BEGINNER')) {
                state.unlockedBadges.push('LOOP_BEGINNER');
                state.xp += 50;
            }
        }

        state.codeSubmissions[challengeId] = code;
        this.updateTopicMasteryForEntity(state, topic, true);
        this.saveState(state);
        return state;
    }

    public recordQuizScore(chapterId: number, scorePercentage: number, passed: boolean): PythonProgressState {
        let state = this.getState();
        state = this.recordActivity();

        const prevScore = state.quizScores[chapterId] || 0;
        if (scorePercentage > prevScore) {
            state.quizScores[chapterId] = scorePercentage;
        }

        if (passed) {
            state.xp += 100;

            if (chapterId === 2 && !state.unlockedBadges.includes('VARIABLE_ROOKIE')) {
                state.unlockedBadges.push('VARIABLE_ROOKIE');
                state.xp += 100;
            }
            if (chapterId === 3 && !state.unlockedBadges.includes('OPERATOR_EXPLORER')) {
                state.unlockedBadges.push('OPERATOR_EXPLORER');
                state.xp += 100;
            }
            if (chapterId === 4 && !state.unlockedBadges.includes('DECISION_MAKER')) {
                state.unlockedBadges.push('DECISION_MAKER');
                state.xp += 100;
            }
            if (chapterId === 5 && !state.unlockedBadges.includes('RANDOM_EXPLORER')) {
                state.unlockedBadges.push('RANDOM_EXPLORER');
                state.xp += 100;
            }
            if (chapterId === 6 && !state.unlockedBadges.includes('LOOP_WARRIOR')) {
                state.unlockedBadges.push('LOOP_WARRIOR');
                state.xp += 100;
            }
        }

        this.saveState(state);
        return state;
    }

    public recordAssessmentResult(result: {
        score: number;
        totalPoints: number;
        percentage: number;
        passed: boolean;
        sectionScores: Record<string, number>;
        phaseId?: number;
    }): PythonProgressState {
        let state = this.getState();
        state = this.recordActivity();

        if (result.phaseId === 2) {
            state.phase2AssessmentResult = {
                ...result,
                completedAt: new Date().toISOString(),
            };
            if (result.passed) {
                state.xp += 200;
                if (!state.unlockedBadges.includes('LOGIC_BUILDER')) {
                    state.unlockedBadges.push('LOGIC_BUILDER');
                    state.xp += 200;
                }
            }
        } else {
            state.assessmentResult = {
                ...result,
                completedAt: new Date().toISOString(),
            };
            if (result.passed) {
                state.xp += 150;
            }
        }

        this.checkPhaseMastery(state);
        this.saveState(state);
        return state;
    }

    public completeProject(projectId: string, code: string, xpReward: number = 150): PythonProgressState {
        let state = this.getState();
        state = this.recordActivity();

        if (!state.completedProjects) state.completedProjects = [];

        if (!state.completedProjects.includes(projectId)) {
            state.completedProjects.push(projectId);
            state.xp += xpReward;
        }

        if (projectId === 'p1-final-project') {
            state.projectCompleted = true;
        }

        state.codeSubmissions[projectId] = code;
        this.checkPhaseMastery(state);
        this.saveState(state);
        return state;
    }

    public completeDailyChallenge(dateStr: string, xpReward: number = 35): PythonProgressState {
        let state = this.getState();
        state = this.recordActivity();

        if (!state.completedDailyChallenges.includes(dateStr)) {
            state.completedDailyChallenges.push(dateStr);
            state.xp += xpReward;
            this.saveState(state);
        }
        return state;
    }

    public logMistake(mistake: Omit<PythonMistake, 'id' | 'timestamp' | 'resolved'>): PythonProgressState {
        const state = this.getState();
        const newMistake: PythonMistake = {
            ...mistake,
            id: `mistake-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            timestamp: new Date().toISOString(),
            resolved: false,
        };

        const existingIdx = state.mistakes.findIndex(
            (m) => m.sourceId === mistake.sourceId && !m.resolved
        );

        if (existingIdx !== -1) {
            state.mistakes[existingIdx] = newMistake;
        } else {
            state.mistakes.unshift(newMistake);
        }

        this.updateTopicMasteryForEntity(state, mistake.topic, false);
        this.saveState(state);
        return state;
    }

    public resolveMistake(mistakeId: string): PythonProgressState {
        const state = this.getState();
        const target = state.mistakes.find((m) => m.id === mistakeId);
        if (target) {
            target.resolved = true;
            this.updateTopicMasteryForEntity(state, target.topic, true);
            this.saveState(state);
        }
        return state;
    }

    public recordHintUsage(entityId: string, level: number): PythonProgressState {
        const state = this.getState();
        const currentLevel = state.usedHints[entityId] || 0;
        if (level > currentLevel) {
            state.usedHints[entityId] = level;
            this.saveState(state);
        }
        return state;
    }

    public saveCodeDraft(entityId: string, code: string) {
        const state = this.getState();
        state.codeSubmissions[entityId] = code;
        this.saveState(state);
    }

    private updateTopicMasteryForEntity(state: PythonProgressState, topic: string, isSuccess: boolean) {
        const key = topic.toLowerCase();
        if (!state.topicMastery[key]) {
            state.topicMastery[key] = {
                topic: key,
                displayName: key.charAt(0).toUpperCase() + key.slice(1),
                score: 0,
                level: 'Beginner',
                totalAttempts: 0,
                successfulAttempts: 0,
            };
        }

        const item = state.topicMastery[key];
        item.totalAttempts += 1;
        if (isSuccess) item.successfulAttempts += 1;

        const ratio = item.totalAttempts > 0 ? (item.successfulAttempts / item.totalAttempts) * 100 : 0;
        item.score = Math.round(ratio);

        if (item.score >= 96) item.level = 'Mastered';
        else if (item.score >= 81) item.level = 'Strong';
        else if (item.score >= 61) item.level = 'Practicing';
        else if (item.score >= 31) item.level = 'Learning';
        else item.level = 'Beginner';
    }

    private checkPhaseMastery(state: PythonProgressState) {
        // Phase 1 Master
        const hasAllP1 = state.quizScores[1] >= 70 && state.quizScores[2] >= 70 && state.quizScores[3] >= 70;
        if (hasAllP1 && state.assessmentResult?.passed && state.projectCompleted && !state.unlockedBadges.includes('PYTHON_FOUNDATION')) {
            state.unlockedBadges.push('PYTHON_FOUNDATION');
            state.xp += 300;
        }

        // Phase 2 Master
        const hasAllP2 = (state.quizScores[4] || 0) >= 70 && (state.quizScores[5] || 0) >= 70 && (state.quizScores[6] || 0) >= 70;
        const p2AssessmentPassed = state.phase2AssessmentResult?.passed;
        const p2ProjectsDone = (state.completedProjects || []).filter((p) => p.startsWith('p2-project-')).length >= 2;

        if (hasAllP2 && p2AssessmentPassed && p2ProjectsDone && !state.unlockedBadges.includes('CONTROL_FLOW_MASTER')) {
            state.unlockedBadges.push('CONTROL_FLOW_MASTER');
            state.xp += 300;
        }
    }

    public getWeakTopics(): TopicMastery[] {
        const state = this.getState();
        return Object.values(state.topicMastery)
            .filter((t) => t.totalAttempts >= 2 && t.score < 70)
            .sort((a, b) => a.score - b.score);
    }
}

export const pythonStorage = new PythonStorageService();
