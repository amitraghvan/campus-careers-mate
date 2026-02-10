/**
 * Prisma Seed Script
 * Seeds the database with initial data for development.
 */

import { PrismaClient, Role, OpportunityStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Create Admin User ──────────────────────────
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@placetrack.dev" },
    update: {},
    create: {
      email: "admin@placetrack.dev",
      name: "Admin User",
      passwordHash: adminPassword,
      college: "PlaceTrack University",
      role: Role.ADMIN,
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // ── Create Demo Student ────────────────────────
  const studentPassword = await bcrypt.hash("student123456", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@placetrack.dev" },
    update: {},
    create: {
      email: "student@placetrack.dev",
      name: "Demo Student",
      passwordHash: studentPassword,
      college: "IIT Delhi",
      role: Role.STUDENT,
    },
  });
  console.log(`  ✓ Student user: ${student.email}`);

  // ── Create Sample Opportunities ────────────────
  const now = new Date();

  const opportunities = [
    {
      userId: student.id,
      company: "Google",
      role: "Software Engineer",
      status: OpportunityStatus.INTERVIEW,
      deadline: new Date(now.getTime() + 3 * 86400000),
      package: "₹45 LPA",
      notes: "Focus on DSA and system design. Review Google's leadership principles.",
    },
    {
      userId: student.id,
      company: "Microsoft",
      role: "Product Manager",
      status: OpportunityStatus.APPLIED,
      deadline: new Date(now.getTime() + 7 * 86400000),
      package: "₹38 LPA",
      notes: "Submitted resume and cover letter. Waiting for shortlist.",
    },
    {
      userId: student.id,
      company: "Amazon",
      role: "SDE Intern",
      status: OpportunityStatus.WISHLIST,
      deadline: new Date(now.getTime() + 14 * 86400000),
      package: "₹1.2L/month",
      notes: "Applications open next week.",
    },
    {
      userId: student.id,
      company: "Flipkart",
      role: "Backend Developer",
      status: OpportunityStatus.SELECTED,
      deadline: new Date(now.getTime() - 5 * 86400000),
      package: "₹28 LPA",
      notes: "Got the offer! Need to respond by next week.",
    },
  ];

  for (const opp of opportunities) {
    const created = await prisma.opportunity.create({ data: opp });
    console.log(`  ✓ Opportunity: ${opp.company} — ${opp.role}`);

    // Add checklist items for Google opportunity
    if (opp.company === "Google") {
      await prisma.checklistItem.createMany({
        data: [
          { opportunityId: created.id, text: "Revise graph algorithms", done: true, sortOrder: 0 },
          { opportunityId: created.id, text: "Practice system design", done: false, sortOrder: 1 },
          { opportunityId: created.id, text: "Mock interview with peer", done: false, sortOrder: 2 },
        ],
      });
    }

    if (opp.company === "Flipkart") {
      await prisma.checklistItem.createMany({
        data: [
          { opportunityId: created.id, text: "Review offer letter", done: true, sortOrder: 0 },
          { opportunityId: created.id, text: "Discuss with family", done: true, sortOrder: 1 },
        ],
      });
    }
  }

  // ── Create Sample Notes ────────────────────────
  await prisma.note.createMany({
    data: [
      {
        userId: student.id,
        title: "DSA Preparation Roadmap",
        content:
          "## Topics to Cover\n\n- Arrays & Strings\n- Linked Lists\n- Trees & Graphs\n- Dynamic Programming\n- Backtracking\n\n## Resources\n- Striver's SDE Sheet\n- LeetCode Top 100",
        tags: ["dsa", "preparation"],
        isPinned: true,
      },
      {
        userId: student.id,
        title: "System Design Notes",
        content:
          "## Key Concepts\n\n- Load Balancing\n- Caching (Redis)\n- Database Sharding\n- Message Queues\n- CDN\n\n## Practice\n- Design URL Shortener\n- Design Chat System",
        tags: ["system-design", "preparation"],
        isPinned: false,
      },
    ],
  });
  console.log("  ✓ Sample notes created");

  console.log("\n✅ Seeding complete!");
  console.log("  Demo credentials:");
  console.log("    Admin:   admin@placetrack.dev / admin123456");
  console.log("    Student: student@placetrack.dev / student123456\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
