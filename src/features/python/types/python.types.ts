/**
 * Python Learning Types & Data Models
 * Supports Phase 1 (Unit I) and Phase 2 (Unit II: Conditions, Randomness, Iteration).
 */

export type DifficultyLevel = 'Beginner' | 'Easy' | 'Medium' | 'Hard';

export interface VisualDiagram {
    type: 'flowchart' | 'table' | 'number_line' | 'grid' | 'step_trace' | 'custom';
    title: string;
    description?: string;
    mermaidCode?: string;
    diagramText?: string;
    data?: {
        headers?: string[];
        rows?: (string | number)[][];
        start?: number;
        stop?: number;
        step?: number;
        gridSize?: { rows: number; cols: number };
        highlightIndex?: number;
        steps?: { step: number; label: string; value: string | number; note?: string }[];
    };
}

export interface PythonPhase {
    id: number;
    unit: string;
    title: string;
    description: string;
    difficulty: DifficultyLevel;
    estimatedHours: string;
    totalChapters: number;
    totalLessons: number;
    totalChallenges: number;
    totalQuizzes: number;
    totalXP: number;
    isLocked: boolean;
    badgeName: string;
    badgeIcon: string;
}

export interface PythonLesson {
    id: string;
    chapterId: number;
    lessonNumber: number;
    title: string;
    description: string;
    durationMinutes: number;
    xpReward: number;
    topics: string[];
    whatYoullLearn: string[];
    concept: string;
    whyItMatters: string;
    visualDiagram?: VisualDiagram;
    syntax: string;
    exampleCode: string;
    expectedOutput: string;
    stepByStepExplanation?: string[];
    commonMistakes?: { mistake: string; fix: string }[];
    interactiveStarterCode: string;
    quickCheck: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
    }[];
    miniChallenge: {
        title: string;
        instruction: string;
        starterCode: string;
        expectedOutputSnippet: string;
        testCases: { input?: string; expectedOutput: string; description: string }[];
        hint: string;
    };
}

export interface TestCase {
    id?: string;
    input?: string;
    expectedOutput: string;
    description: string;
    isHidden?: boolean;
    regexPattern?: string; // For testing random outputs (e.g. dice 1-6)
}

export interface AIHint {
    level: 1 | 2 | 3 | 4;
    title: string;
    content: string;
}

export interface PythonChallenge {
    id: string;
    chapterId: number;
    challengeNumber: number;
    title: string;
    difficulty: DifficultyLevel;
    xpReward: number;
    description: string;
    instructions: string[];
    starterCode: string;
    solutionCode: string;
    solutionExplanation: string;
    hints: AIHint[];
    testCases: TestCase[];
    topicCategory:
        | 'environment'
        | 'variables'
        | 'types'
        | 'expressions'
        | 'operators'
        | 'strings'
        | 'debugging'
        | 'conditions'
        | 'booleans'
        | 'random'
        | 'while_loops'
        | 'for_loops'
        | 'range'
        | 'nested_loops'
        | 'patterns'
        | 'counters'
        | 'accumulators'
        | 'encapsulation'
        | 'generalization';
}

export interface PythonQuizQuestion {
    id: string;
    question: string;
    codeSnippet?: string;
    type: 'mcq' | 'true_false' | 'predict_output' | 'identify_error' | 'conceptual' | 'flowchart';
    options: string[];
    correctAnswer: number;
    explanation: string;
    topic: string;
    flowchartAscii?: string;
}

export interface PythonQuiz {
    chapterId: number;
    title: string;
    description: string;
    passingScorePercent: number;
    xpReward: number;
    questions: PythonQuizQuestion[];
}

export interface AssessmentQuestion {
    id: string;
    section: 'A' | 'B' | 'C' | 'D' | 'E'; // A: Concepts, B: Predict Output, C: Debugging, D: Flowcharts/Logic, E: Coding
    sectionTitle: string;
    title: string;
    question: string;
    codeSnippet?: string;
    flowchartAscii?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    // For Coding Questions
    starterCode?: string;
    solutionCode?: string;
    testCases?: TestCase[];
    difficulty?: DifficultyLevel;
    points: number;
    topic: string;
}

export interface PythonAssessment {
    id: string;
    phaseId: number;
    title: string;
    description: string;
    durationMinutes: number;
    passingScorePercent: number;
    xpReward: number;
    totalPoints: number;
    sections: {
        id: 'A' | 'B' | 'C' | 'D' | 'E';
        title: string;
        description: string;
        questionCount: number;
    }[];
    questions: AssessmentQuestion[];
}

export interface PythonProject {
    id: string;
    phaseId: number;
    title: string;
    badgeName: string;
    xpReward: number;
    difficulty: DifficultyLevel;
    overview: string;
    problemStatement: string;
    requirements: string[];
    sampleOutput: string;
    starterCode: string;
    solutionCode: string;
    hints: AIHint[];
    testCases: TestCase[];
}

export interface PythonDailyChallenge {
    id: string;
    date: string;
    title: string;
    description: string;
    xpReward: number;
    difficulty: DifficultyLevel;
    starterCode: string;
    testCases: TestCase[];
    hints: string[];
}

export interface PythonChapter {
    id: number;
    chapterNumber: number;
    title: string;
    subtitle: string;
    description: string;
    estimatedMinutes: number;
    xpReward: number;
    badgeName: string;
    badgeIcon: string;
    lessons: PythonLesson[];
    challenges: PythonChallenge[];
    quiz: PythonQuiz;
}

export interface PythonBadge {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    xpValue: number;
    category: 'phase' | 'chapter' | 'streak' | 'mastery' | 'milestone';
}

export interface PythonMistake {
    id: string;
    sourceType: 'lesson_quick_check' | 'challenge' | 'quiz' | 'assessment';
    sourceId: string;
    questionText: string;
    codeSnippet?: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    explanation: string;
    topic: string;
    timestamp: string;
    resolved: boolean;
}

export interface TopicMastery {
    topic: string;
    displayName: string;
    score: number; // 0 - 100
    level: 'Beginner' | 'Learning' | 'Practicing' | 'Strong' | 'Mastered';
    totalAttempts: number;
    successfulAttempts: number;
}

export interface PythonProgressState {
    xp: number;
    currentStreak: number;
    bestStreak: number;
    lastActiveDate: string;
    freezeDaysRemaining: number;
    streakHistory: string[];
    completedLessons: string[]; // lesson ids
    completedChallenges: string[]; // challenge ids
    completedDailyChallenges: string[]; // date strings YYYY-MM-DD
    quizScores: Record<number, number>; // chapterId -> percentage
    assessmentResult?: {
        score: number;
        totalPoints: number;
        percentage: number;
        passed: boolean;
        completedAt: string;
        sectionScores: Record<string, number>;
    };
    phase2AssessmentResult?: {
        score: number;
        totalPoints: number;
        percentage: number;
        passed: boolean;
        completedAt: string;
        sectionScores: Record<string, number>;
    };
    projectCompleted: boolean;
    completedProjects: string[]; // project ids (p1-final-project, p2-dice-roller, p2-number-guessing, p2-rock-paper-scissors)
    unlockedBadges: string[]; // badge ids
    unlockedChapters: number[]; // chapter ids
    mistakes: PythonMistake[];
    topicMastery: Record<string, TopicMastery>;
    usedHints: Record<string, number>; // entityId -> max hint level revealed
    codeSubmissions: Record<string, string>; // entityId -> latest code
}
