import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Opportunity, OpportunityStatus, ChecklistItem } from "@/types/opportunity";

interface OpportunityContextType {
  opportunities: Opportunity[];
  addOpportunity: (opp: Omit<Opportunity, "id" | "createdAt" | "checklist">) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  toggleChecklistItem: (oppId: string, itemId: string) => void;
  addChecklistItem: (oppId: string, text: string) => void;
  removeChecklistItem: (oppId: string, itemId: string) => void;
}

const OpportunityContext = createContext<OpportunityContextType | null>(null);

const STORAGE_KEY = "placement-tracker-opportunities";

function loadOpportunities(): Opportunity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getSampleData();
  } catch {
    return getSampleData();
  }
}

function saveOpportunities(opps: Opportunity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(opps));
}

function getSampleData(): Opportunity[] {
  const now = new Date();
  return [
    {
      id: "1",
      company: "Google",
      role: "Software Engineer",
      status: "interview",
      deadline: new Date(now.getTime() + 3 * 86400000).toISOString().split("T")[0],
      package: "₹45 LPA",
      notes: "Focus on DSA and system design. Review Google's leadership principles.",
      checklist: [
        { id: "c1", text: "Revise graph algorithms", done: true },
        { id: "c2", text: "Practice system design", done: false },
        { id: "c3", text: "Mock interview with peer", done: false },
      ],
      createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
    },
    {
      id: "2",
      company: "Microsoft",
      role: "Product Manager",
      status: "applied",
      deadline: new Date(now.getTime() + 7 * 86400000).toISOString().split("T")[0],
      package: "₹38 LPA",
      notes: "Submitted resume and cover letter. Waiting for shortlist.",
      checklist: [
        { id: "c4", text: "Prepare product case studies", done: false },
      ],
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    },
    {
      id: "3",
      company: "Amazon",
      role: "SDE Intern",
      status: "wishlist",
      deadline: new Date(now.getTime() + 14 * 86400000).toISOString().split("T")[0],
      package: "₹1.2L/month",
      notes: "",
      checklist: [],
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    },
    {
      id: "4",
      company: "Flipkart",
      role: "Backend Developer",
      status: "selected",
      deadline: new Date(now.getTime() - 5 * 86400000).toISOString().split("T")[0],
      package: "₹28 LPA",
      notes: "Got the offer! Need to respond by next week.",
      checklist: [
        { id: "c5", text: "Review offer letter", done: true },
        { id: "c6", text: "Discuss with family", done: true },
      ],
      createdAt: new Date(now.getTime() - 14 * 86400000).toISOString(),
    },
  ];
}

export function OpportunityProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(loadOpportunities);

  const persist = useCallback((opps: Opportunity[]) => {
    setOpportunities(opps);
    saveOpportunities(opps);
  }, []);

  const addOpportunity = useCallback((opp: Omit<Opportunity, "id" | "createdAt" | "checklist">) => {
    const newOpp: Opportunity = {
      ...opp,
      id: crypto.randomUUID(),
      checklist: [],
      createdAt: new Date().toISOString(),
    };
    setOpportunities((prev) => {
      const next = [newOpp, ...prev];
      saveOpportunities(next);
      return next;
    });
  }, []);

  const updateOpportunity = useCallback((id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, ...updates } : o));
      saveOpportunities(next);
      return next;
    });
  }, []);

  const deleteOpportunity = useCallback((id: string) => {
    setOpportunities((prev) => {
      const next = prev.filter((o) => o.id !== id);
      saveOpportunities(next);
      return next;
    });
  }, []);

  const toggleChecklistItem = useCallback((oppId: string, itemId: string) => {
    setOpportunities((prev) => {
      const next = prev.map((o) =>
        o.id === oppId
          ? { ...o, checklist: o.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) }
          : o
      );
      saveOpportunities(next);
      return next;
    });
  }, []);

  const addChecklistItem = useCallback((oppId: string, text: string) => {
    setOpportunities((prev) => {
      const next = prev.map((o) =>
        o.id === oppId
          ? { ...o, checklist: [...o.checklist, { id: crypto.randomUUID(), text, done: false }] }
          : o
      );
      saveOpportunities(next);
      return next;
    });
  }, []);

  const removeChecklistItem = useCallback((oppId: string, itemId: string) => {
    setOpportunities((prev) => {
      const next = prev.map((o) =>
        o.id === oppId
          ? { ...o, checklist: o.checklist.filter((c) => c.id !== itemId) }
          : o
      );
      saveOpportunities(next);
      return next;
    });
  }, []);

  return (
    <OpportunityContext.Provider
      value={{ opportunities, addOpportunity, updateOpportunity, deleteOpportunity, toggleChecklistItem, addChecklistItem, removeChecklistItem }}
    >
      {children}
    </OpportunityContext.Provider>
  );
}

export function useOpportunities() {
  const ctx = useContext(OpportunityContext);
  if (!ctx) throw new Error("useOpportunities must be used within OpportunityProvider");
  return ctx;
}

