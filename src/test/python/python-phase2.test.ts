import { describe, it, expect } from 'vitest';
import {
    PHASE_2_CHAPTERS,
    PHASE_2_ASSESSMENT,
    PHASE_2_PROJECTS,
    UNIT_2_EXAM_REVISION,
} from '@/features/python/data/python-phase2.data';
import { pythonStorage, INITIAL_BADGES } from '@/features/python/services/python-storage.service';

describe('Phase 2 Curriculum & Data Integrity (Unit II)', () => {
    it('contains all 3 core chapters (4, 5, 6)', () => {
        expect(PHASE_2_CHAPTERS.length).toBe(3);
        expect(PHASE_2_CHAPTERS[0].id).toBe(4);
        expect(PHASE_2_CHAPTERS[1].id).toBe(5);
        expect(PHASE_2_CHAPTERS[2].id).toBe(6);
    });

    it('Chapter 4 (Conditionals) contains 17 comprehensive lessons with visual diagrams, 10 challenges, and 15-question quiz', () => {
        const ch4 = PHASE_2_CHAPTERS[0];
        expect(ch4.title).toBe('Conditional Statements');
        expect(ch4.lessons.length).toBe(17);
        expect(ch4.challenges.length).toBe(10);
        expect(ch4.quiz.questions.length).toBe(15);

        // Verify visual diagrams are present
        const withDiagrams = ch4.lessons.filter((l) => l.visualDiagram);
        expect(withDiagrams.length).toBeGreaterThan(5);
    });

    it('Chapter 5 (Random Numbers) contains 9 lessons, 6 challenges, and 10-question quiz', () => {
        const ch5 = PHASE_2_CHAPTERS[1];
        expect(ch5.title).toBe('Random Numbers');
        expect(ch5.lessons.length).toBe(9);
        expect(ch5.challenges.length).toBe(6);
        expect(ch5.quiz.questions.length).toBe(10);
    });

    it('Chapter 6 (Iteration) contains 19 lessons with step traces, 12 challenges, and 15-question quiz', () => {
        const ch6 = PHASE_2_CHAPTERS[2];
        expect(ch6.title).toBe('Iterative Statements');
        expect(ch6.lessons.length).toBe(19);
        expect(ch6.challenges.length).toBe(12);
        expect(ch6.quiz.questions.length).toBe(15);
    });

    it('provides all 3 interactive mini projects for Phase 2', () => {
        expect(PHASE_2_PROJECTS.length).toBe(3);
        expect(PHASE_2_PROJECTS.map((p) => p.id)).toEqual([
            'p2-project-dice-roller',
            'p2-project-number-guessing',
            'p2-project-rock-paper-scissors',
        ]);
        PHASE_2_PROJECTS.forEach((proj) => {
            expect(proj.testCases.length).toBeGreaterThan(0);
            expect(proj.hints.length).toBeGreaterThanOrEqual(3);
            expect(proj.solutionCode.length).toBeGreaterThan(20);
        });
    });

    it('provides Phase 2 comprehensive assessment with 35 questions across 5 sections (A-E)', () => {
        expect(PHASE_2_ASSESSMENT.questions.length).toBe(35);
        expect(PHASE_2_ASSESSMENT.sections.length).toBe(5);

        const secA = PHASE_2_ASSESSMENT.questions.filter((q) => q.section === 'A');
        const secB = PHASE_2_ASSESSMENT.questions.filter((q) => q.section === 'B');
        const secC = PHASE_2_ASSESSMENT.questions.filter((q) => q.section === 'C');
        const secD = PHASE_2_ASSESSMENT.questions.filter((q) => q.section === 'D');
        const secE = PHASE_2_ASSESSMENT.questions.filter((q) => q.section === 'E');

        expect(secA.length).toBe(10);
        expect(secB.length).toBe(10);
        expect(secC.length).toBe(5);
        expect(secD.length).toBe(5);
        expect(secE.length).toBe(5);
    });

    it('provides Unit II exam revision with definitions, syntax cheat-sheets, and common pitfalls', () => {
        expect(UNIT_2_EXAM_REVISION.keyDefinitions.length).toBeGreaterThan(5);
        expect(UNIT_2_EXAM_REVISION.syntaxCheatsheet.length).toBeGreaterThan(8);
        expect(UNIT_2_EXAM_REVISION.commonPitfalls.length).toBeGreaterThan(5);
    });
});

describe('Phase 2 Storage & Gamification Badges', () => {
    it('has all Phase 2 badges registered', () => {
        const badgeIds = INITIAL_BADGES.map((b) => b.id);
        expect(badgeIds).toContain('DECISION_MAKER');
        expect(badgeIds).toContain('RANDOM_EXPLORER');
        expect(badgeIds).toContain('LOOP_BEGINNER');
        expect(badgeIds).toContain('LOOP_WARRIOR');
        expect(badgeIds).toContain('LOGIC_BUILDER');
        expect(badgeIds).toContain('CONTROL_FLOW_MASTER');
    });

    it('keeps all chapters [1, 2, 3, 4, 5, 6] unlocked by default as requested by user', () => {
        const state = pythonStorage.getState();
        expect(state.unlockedChapters).toContain(1);
        expect(state.unlockedChapters).toContain(2);
        expect(state.unlockedChapters).toContain(3);
        expect(state.unlockedChapters).toContain(4);
        expect(state.unlockedChapters).toContain(5);
        expect(state.unlockedChapters).toContain(6);
    });
});
