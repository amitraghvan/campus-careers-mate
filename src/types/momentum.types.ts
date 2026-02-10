export type GoalType = "APPLICATION" | "COLD_EMAIL" | "INTERVIEW_PREP" | "NOTE_TAKING" | "CUSTOM";

export interface Goal {
    id: string;
    text: string;
    type: GoalType;
    completed: boolean;
    completedAt?: string; // ISO date
    createdAt: string; // ISO date
    isRollover: boolean; // True if carried over from yesterday
}

export type ChallengeType = "OUTREACH" | "PREP" | "ORGANIZATION" | "MINDSET";

export interface Challenge {
    id: string;
    text: string;
    type: ChallengeType;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    completed: boolean;
    date: string; // YYYY-MM-DD
}

export interface Streak {
    currentStreak: number;
    bestStreak: number;
    lastActivityDate: string; // YYYY-MM-DD
    history: string[]; // List of dates with activity
    freezeDaysRemaining: number; // Grace days available
}

export type BadgeId =
    | "FIRST_STEP"
    | "CONSISTENCY_3"
    | "CONSISTENCY_7"
    | "CONSISTENCY_30"
    | "OUTREACH_MASTER"
    | "INTERVIEW_READY";

export interface Badge {
    id: BadgeId;
    name: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    unlockedAt?: string; // ISO date
}

export interface MomentumState {
    goals: Goal[];
    challenge: Challenge | null;
    streak: Streak;
    badges: Badge[];
    lastVisit: string; // ISO date
}
