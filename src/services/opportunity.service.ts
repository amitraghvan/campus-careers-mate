/**
 * Opportunity Service
 * Encapsulates all data access for opportunities.
 * Currently uses localStorage — can be swapped to REST/GraphQL.
 */

import type { Opportunity, CreateOpportunityDTO } from "@/types";
import { storage } from "@/utils";
import { APP_CONFIG } from "@/config";
import { generateSampleOpportunities } from "@/services/data/opportunity.seed";

const STORAGE_KEY = APP_CONFIG.storage.opportunitiesKey;

export const opportunityService = {
  /** Load all opportunities from storage */
  getAll(): Opportunity[] {
    const data = storage.get<Opportunity[] | null>(STORAGE_KEY, null);
    if (data) return data;

    // First-time user: seed with sample data
    const seed = generateSampleOpportunities();
    storage.set(STORAGE_KEY, seed);
    return seed;
  },

  /** Persist the full list */
  saveAll(opportunities: Opportunity[]): void {
    storage.set(STORAGE_KEY, opportunities);
  },

  /** Create a new opportunity */
  create(dto: CreateOpportunityDTO): Opportunity {
    return {
      ...dto,
      id: crypto.randomUUID(),
      checklist: [],
      history: [{ status: dto.status, date: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };
  },

  /** Clear all data (reset) */
  reset(): void {
    storage.remove(STORAGE_KEY);
  },
};

