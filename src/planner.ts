import type { PlanConfig, StudySprint, StudyUnit } from "./types";
import { buildUnits } from "./syllabus";

function formatDate(base: Date, day: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + day - 1);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function generatePlan(config: PlanConfig): StudySprint[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exam = new Date(config.examDate + "T00:00:00");
  const daysRemaining = Math.max(
    1,
    Math.round((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );

  const allUnits = buildUnits(config.weakAreas);
  if (allUnits.length === 0) return [];

  // Units per day based on daily study hours (1 unit ≈ 45 min, avg sprint of 2-3 units).
  const unitsPerDay = Math.max(1, Math.min(4, Math.round(config.dailyHours / 0.75)));

  // If time is very tight (fewer days than subtopics), prioritize: pack more units per day.
  const studyDays = daysRemaining;
  const reviewThreshold = Math.floor(studyDays * 0.75); // last 25% reserved for review

  const sprints: StudySprint[] = [];
  let unitIdx = 0;

  for (let day = 1; day <= studyDays; day++) {
    const isReview = day > reviewThreshold;
    const items: StudyUnit[] = [];

    if (isReview) {
      // On review days, cycle back through weak areas starting from the front.
      const reviewStart = (day - reviewThreshold - 1) * unitsPerDay;
      for (let i = 0; i < unitsPerDay; i++) {
        const u = allUnits[(reviewStart + i) % allUnits.length];
        items.push({ ...u, subtopic: `Review — ${u.subtopic}` });
      }
    } else {
      for (let i = 0; i < unitsPerDay && unitIdx < allUnits.length; i++) {
        items.push(allUnits[unitIdx]);
        unitIdx++;
      }
    }

    if (items.length === 0) {
      // Reuse remaining days as light review if we ran out of fresh material early.
      const u = allUnits[(day - 1) % allUnits.length];
      items.push({ ...u, subtopic: `Review — ${u.subtopic}` });
    }

    sprints.push({
      day,
      date: formatDate(now, day),
      items,
      isReview,
    });
  }

  return sprints;
}
