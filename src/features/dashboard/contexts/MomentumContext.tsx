import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { MomentumState, Goal, Challenge, Streak, Badge } from "@/types/momentum.types";
import { momentumService } from "@/services/momentum.service";

interface MomentumContextType {
    state: MomentumState | null;
    addGoal: (text: string) => void;
    toggleGoal: (id: string) => void;
    completeChallenge: () => void;
    refreshState: () => void;
}

const MomentumContext = createContext<MomentumContextType | null>(null);

export function MomentumProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<MomentumState | null>(null);

    const refreshState = useCallback(() => {
        const createDefaultState: MomentumState = {
            goals: [],
            challenge: null,
            streak: {
                currentStreak: 0,
                bestStreak: 0,
                lastActivityDate: "",
                history: [],
                freezeDaysRemaining: 2
            },
            badges: [],
            lastVisit: new Date().toISOString()
        };
        // momentumService.getState() might return null if something is wrong, but typically handles init.
        // We'll wrap to be safe or ensure service always returns state.
        // Actually service.getState() initializes if null.
        const current = momentumService.getState();
        setState(current);
    }, []);

    useEffect(() => {
        refreshState();
    }, [refreshState]);

    const addGoal = useCallback((text: string) => {
        if (!state) return;
        const newGoals = momentumService.addGoal(state.goals, text);
        const newState = { ...state, goals: newGoals };
        momentumService.saveState(newState);
        setState(newState);
    }, [state]);

    const toggleGoal = useCallback((id: string) => {
        if (!state) return;
        const newState = momentumService.completeGoal(state, id);
        setState(newState);
    }, [state]);

    const completeChallenge = useCallback(() => {
        if (!state) return;
        const newState = momentumService.completeChallenge(state);
        setState(newState);
    }, [state]);

    return (
        <MomentumContext.Provider value={{ state, addGoal, toggleGoal, completeChallenge, refreshState }}>
            {children}
        </MomentumContext.Provider>
    );
}

export function useMomentum() {
    const context = useContext(MomentumContext);
    if (!context) {
        throw new Error("useMomentum must be used within a MomentumProvider");
    }
    return context;
}
