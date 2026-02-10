import { MomentumState, Goal, Challenge, Streak, Badge, GoalType, BadgeId } from "@/types/momentum.types";
import { storage } from "@/utils";
import { APP_CONFIG } from "@/config";

const STORAGE_KEY = "daily_momentum_system";

const INITIAL_STREAK: Streak = {
    currentStreak: 0,
    bestStreak: 0,
    lastActivityDate: "",
    history: [],
    freezeDaysRemaining: 2, // Start with 2 grace days
};

const BADGES: Badge[] = [
    { id: "FIRST_STEP", name: "First Step", description: "Completed your first daily goal", icon: "🚀" },
    { id: "CONSISTENCY_3", name: "Momentum Builder", description: "3 day streak", icon: "🔥" },
    { id: "CONSISTENCY_7", name: "Unstoppable", description: "7 day streak", icon: "⚡" },
    { id: "CONSISTENCY_30", name: "Discipline Master", description: "30 day streak", icon: "👑" },
    { id: "OUTREACH_MASTER", name: "Networker", description: "Sent 10 cold emails", icon: "📧" },
];

const CHALLENGES = [
    { text: "Send 1 cold email to a founder", type: "OUTREACH", difficulty: "MEDIUM" },
    { text: "Connect with 3 alumni on LinkedIn", type: "OUTREACH", difficulty: "EASY" },
    { text: "Review your resume for 10 mins", type: "PREP", difficulty: "EASY" },
    { text: "Solve 1 LeetCode Easy", type: "PREP", difficulty: "MEDIUM" },
    { text: "Organize your application tracker", type: "ORGANIZATION", difficulty: "EASY" },
] as const;

export const momentumService = {
    getState(): MomentumState {
        const stored = storage.get<MomentumState | null>(STORAGE_KEY, null);
        const today = new Date().toISOString().split("T")[0];

        if (!stored) {
            return this.initializeNewState(today);
        }

        // If it's a new day, process daily reset/rollover
        const lastDate = stored.lastVisit.split("T")[0];
        if (lastDate !== today) {
            return this.processDailyReset(stored, today);
        }

        return stored;
    },

    saveState(state: MomentumState) {
        storage.set(STORAGE_KEY, state);
    },

    initializeNewState(today: string): MomentumState {
        const initialState: MomentumState = {
            goals: [],
            challenge: this.generateDailyChallenge(today),
            streak: INITIAL_STREAK,
            badges: BADGES,
            lastVisit: new Date().toISOString(),
        };
        this.saveState(initialState);
        return initialState;
    },

    processDailyReset(state: MomentumState, today: string): MomentumState {
        // 1. Handle Streak
        const lastActivity = state.streak.lastActivityDate;
        let newStreak = { ...state.streak };

        if (lastActivity) {
            const daysDiff = this.getDaysDifference(lastActivity, today);
            if (daysDiff === 1) {
                // Continued streak (visual update happens on completion)
            } else if (daysDiff > 1) {
                // Missed a day
                if (newStreak.freezeDaysRemaining > 0) {
                    newStreak.freezeDaysRemaining--; // Use freeze
                    // Streak stays same
                } else {
                    newStreak.currentStreak = 0; // Reset
                }
            }
        }

        // 2. Rollover incomplete goals (Max 3 total Allowed)
        const incompleteGoals = state.goals.filter(g => !g.completed).map(g => ({ ...g, isRollover: true }));
        // Only keep up to 2 items to avoid overwhelm
        const rolloverGoals = incompleteGoals.slice(0, 2);

        // 3. New Challenge
        const newChallenge = this.generateDailyChallenge(today);

        const newState: MomentumState = {
            ...state,
            goals: rolloverGoals,
            challenge: newChallenge,
            streak: newStreak,
            lastVisit: new Date().toISOString(),
        };

        this.saveState(newState);
        return newState;
    },

    generateDailyChallenge(date: string): Challenge {
        // Simple random for now, can be smarter later
        const template = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
        return {
            id: crypto.randomUUID(),
            text: template.text,
            type: template.type,
            difficulty: template.difficulty,
            completed: false,
            date: date,
        };
    },

    addGoal(currentGoals: Goal[], text: string, type: GoalType = "CUSTOM"): Goal[] {
        if (currentGoals.length >= 3) return currentGoals; // Max 3 goals constraint

        const newGoal: Goal = {
            id: crypto.randomUUID(),
            text,
            type,
            completed: false,
            createdAt: new Date().toISOString(),
            isRollover: false,
        };
        return [...currentGoals, newGoal];
    },

    deleteGoal(state: MomentumState, goalId: string): MomentumState {
        const newGoals = state.goals.filter(g => g.id !== goalId);
        return { ...state, goals: newGoals };
    },

    completeGoal(state: MomentumState, goalId: string): MomentumState {
        const newGoals = state.goals.map(g =>
            g.id === goalId ? { ...g, completed: !g.completed, completedAt: new Date().toISOString() } : g
        );

        return this.checkAchievements({ ...state, goals: newGoals });
    },

    completeChallenge(state: MomentumState): MomentumState {
        if (!state.challenge) return state;
        const newChallenge = { ...state.challenge, completed: true };
        return this.checkAchievements({ ...state, challenge: newChallenge });
    },

    checkAchievements(state: MomentumState): MomentumState {
        const today = new Date().toISOString().split("T")[0];
        let newStreak = { ...state.streak };
        let newBadges = [...state.badges];

        // Check for daily activity (Goal OR Challenge)
        const hasActivityToday = state.goals.some(g => g.completed) || state.challenge?.completed;

        if (hasActivityToday && newStreak.lastActivityDate !== today) {
            newStreak.currentStreak++;
            newStreak.lastActivityDate = today;
            newStreak.history.push(today);
            if (newStreak.currentStreak > newStreak.bestStreak) {
                newStreak.bestStreak = newStreak.currentStreak;
            }
        }

        // Unlock badges
        if (state.goals.some(g => g.completed) && !this.hasBadge(newBadges, "FIRST_STEP")) {
            newBadges = this.unlockBadge(newBadges, "FIRST_STEP");
        }
        if (newStreak.currentStreak >= 3 && !this.hasBadge(newBadges, "CONSISTENCY_3")) {
            newBadges = this.unlockBadge(newBadges, "CONSISTENCY_3");
        }
        if (newStreak.currentStreak >= 7 && !this.hasBadge(newBadges, "CONSISTENCY_7")) {
            newBadges = this.unlockBadge(newBadges, "CONSISTENCY_7");
        }

        const newState = { ...state, streak: newStreak, badges: newBadges };
        this.saveState(newState);
        return newState;
    },

    getDaysDifference(date1: string, date2: string): number {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    hasBadge(badges: Badge[], id: BadgeId): boolean {
        return badges.find(b => b.id === id)?.unlockedAt !== undefined;
    },

    unlockBadge(badges: Badge[], id: BadgeId): Badge[] {
        return badges.map(b => b.id === id ? { ...b, unlockedAt: new Date().toISOString() } : b);
    }
};
