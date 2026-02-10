/**
 * Mock / seed data for new users.
 * In production, this would come from an API.
 */

import type { Opportunity } from "@/types";

export function generateSampleOpportunities(): Opportunity[] {
  const now = new Date();

  return [
    {
      id: "seed-1",
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
      history: [{ status: "interview", date: new Date(now.getTime() - 7 * 86400000).toISOString() }],
      createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
    },
    {
      id: "seed-2",
      company: "Microsoft",
      role: "Product Manager",
      status: "applied",
      deadline: new Date(now.getTime() + 7 * 86400000).toISOString().split("T")[0],
      package: "₹38 LPA",
      notes: "Submitted resume and cover letter. Waiting for shortlist.",
      checklist: [
        { id: "c4", text: "Prepare product case studies", done: false },
      ],
      history: [{ status: "applied", date: new Date(now.getTime() - 3 * 86400000).toISOString() }],
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    },
    {
      id: "seed-3",
      company: "Amazon",
      role: "SDE Intern",
      status: "wishlist",
      deadline: new Date(now.getTime() + 14 * 86400000).toISOString().split("T")[0],
      package: "₹1.2L/month",
      notes: "",
      checklist: [],
      history: [{ status: "wishlist", date: new Date(now.getTime() - 1 * 86400000).toISOString() }],
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    },
    {
      id: "seed-4",
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
      history: [{ status: "selected", date: new Date(now.getTime() - 14 * 86400000).toISOString() }],
      createdAt: new Date(now.getTime() - 14 * 86400000).toISOString(),
    },
  ];
}

