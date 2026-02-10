/**
 * Opportunity Context — state management for opportunities.
 * Provides CRUD operations and checklist management.
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Opportunity, CreateOpportunityDTO } from "@/types";
import { opportunityService } from "@/services";

interface OpportunityContextType {
  opportunities: Opportunity[];
  addOpportunity: (opp: CreateOpportunityDTO) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  toggleChecklistItem: (oppId: string, itemId: string) => void;
  addChecklistItem: (oppId: string, text: string) => void;
  removeChecklistItem: (oppId: string, itemId: string) => void;
}

const OpportunityContext = createContext<OpportunityContextType | null>(null);

export function OpportunityProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    () => opportunityService.getAll()
  );

  const persist = useCallback((updater: (prev: Opportunity[]) => Opportunity[]) => {
    setOpportunities((prev) => {
      const next = updater(prev);
      opportunityService.saveAll(next);
      return next;
    });
  }, []);

  const addOpportunity = useCallback(
    (dto: CreateOpportunityDTO) => {
      const newOpp = opportunityService.create(dto);
      persist((prev) => [newOpp, ...prev]);
    },
    [persist]
  );

  const updateOpportunity = useCallback(
    (id: string, updates: Partial<Opportunity>) => {
      persist((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    },
    [persist]
  );

  const deleteOpportunity = useCallback(
    (id: string) => {
      persist((prev) => prev.filter((o) => o.id !== id));
    },
    [persist]
  );

  const toggleChecklistItem = useCallback(
    (oppId: string, itemId: string) => {
      persist((prev) =>
        prev.map((o) =>
          o.id === oppId
            ? {
                ...o,
                checklist: o.checklist.map((c) =>
                  c.id === itemId ? { ...c, done: !c.done } : c
                ),
              }
            : o
        )
      );
    },
    [persist]
  );

  const addChecklistItem = useCallback(
    (oppId: string, text: string) => {
      persist((prev) =>
        prev.map((o) =>
          o.id === oppId
            ? {
                ...o,
                checklist: [
                  ...o.checklist,
                  { id: crypto.randomUUID(), text, done: false },
                ],
              }
            : o
        )
      );
    },
    [persist]
  );

  const removeChecklistItem = useCallback(
    (oppId: string, itemId: string) => {
      persist((prev) =>
        prev.map((o) =>
          o.id === oppId
            ? { ...o, checklist: o.checklist.filter((c) => c.id !== itemId) }
            : o
        )
      );
    },
    [persist]
  );

  return (
    <OpportunityContext.Provider
      value={{
        opportunities,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        toggleChecklistItem,
        addChecklistItem,
        removeChecklistItem,
      }}
    >
      {children}
    </OpportunityContext.Provider>
  );
}

/**
 * Hook to access opportunity context.
 * Must be used within OpportunityProvider.
 */
export function useOpportunityContext() {
  const ctx = useContext(OpportunityContext);
  if (!ctx) {
    throw new Error("useOpportunityContext must be used within OpportunityProvider");
  }
  return ctx;
}

