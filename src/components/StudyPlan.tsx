import { useMemo } from "react";
import { Circle, CheckCircle2, Lightbulb, Share2, Sparkles } from "lucide-react";
import type { PlanConfig, StudySprint } from "../types";
import { buildUnits } from "../syllabus";

interface StudyPlanProps {
  config: PlanConfig;
  sprints: StudySprint[];
  completed: Record<number, boolean>;
  onToggle: (day: number) => void;
  onShare: () => void;
}

export function StudyPlan({
  config,
  sprints,
  completed,
  onToggle,
  onShare,
}: StudyPlanProps) {
  const daysLeft = useMemo(() => {
    const ms = new Date(config.examDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [config.examDate]);

  const totalDays = sprints.length;
  const doneCount = Object.values(completed).filter(Boolean).length;
  const progress = totalDays ? Math.round((doneCount / totalDays) * 100) : 0;

  const shareText = useMemo(() => {
    const lines = sprints.map((s) => {
      const status = completed[s.day] ? "[x]" : "[ ]";
      const subs = s.items.map((i) => `  • ${i.area}: ${i.subtopic}`).join("\n");
      return `Day ${s.day} ${status}\n${subs}`;
    });
    return `AZ-900 Vibe Planner — Study Plan\nExam: ${config.examDate} (${daysLeft} days left)\nDaily hours: ${config.dailyHours}\n\n${lines.join("\n\n")}`;
  }, [sprints, completed, config, daysLeft]);

  const handleShare = () => {
    navigator.clipboard?.writeText(shareText).catch(() => {});
    onShare();
  };

  return (
    <section className="space-y-5">
      {/* Progress header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-azure-400">{daysLeft}</span>
            <span className="text-sm text-slate-400">days left until exam</span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-azure-500 to-azure-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {doneCount} of {totalDays} study sprints completed ({progress}%)
          </p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-xl border border-azure-500/40 bg-azure-500/10 px-5 py-3 text-sm font-semibold text-azure-300 transition hover:bg-azure-500/20 hover:text-azure-200"
        >
          <Share2 className="h-4 w-4" />
          Share Plan
        </button>
      </div>

      {/* Vibe Check */}
      <VibeCheck daysLeft={daysLeft} doneCount={doneCount} totalDays={totalDays} />

      {/* Sprints */}
      <div className="space-y-3">
        {sprints.map((sprint) => {
          const isDone = !!completed[sprint.day];
          return (
            <div
              key={sprint.day}
              className={`rounded-2xl border p-5 backdrop-blur-sm transition ${
                isDone
                  ? "border-emerald-600/40 bg-emerald-950/20"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => onToggle(sprint.day)}
                  className="mt-0.5 shrink-0 transition hover:scale-105"
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <Circle className="h-6 w-6 text-slate-600 hover:text-azure-400" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-base font-semibold ${
                        isDone ? "text-slate-400 line-through" : "text-slate-100"
                      }`}
                    >
                      Day {sprint.day}:{" "}
                      {sprint.items.map((i) => i.area).join(", ")}
                    </h3>
                    {sprint.isReview && (
                      <span className="rounded-full border border-azure-500/40 bg-azure-500/10 px-2.5 py-0.5 text-xs font-medium text-azure-300">
                        Review
                      </span>
                    )}
                    {isDone && (
                      <span className="rounded-full border border-emerald-600/40 bg-emerald-600/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{sprint.date}</p>

                  <ul className="mt-3 space-y-2">
                    {sprint.items.map((item, idx) => (
                      <li key={idx}>
                        <span className="text-sm font-medium text-slate-200">
                          {item.area}
                        </span>
                        <span className="text-slate-400"> — {item.subtopic}</span>
                      </li>
                    ))}
                  </ul>

                  {sprint.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="mt-3 flex gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"
                    >
                      <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" />
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-amber-300">
                          AI Tip:{" "}
                        </span>
                        {item.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface VibeCheckProps {
  daysLeft: number;
  doneCount: number;
  totalDays: number;
}

function VibeCheck({ daysLeft, doneCount, totalDays }: VibeCheckProps) {
  const { message, tone } = useMemo(() => {
    if (daysLeft < 7) {
      return {
        message: "Crunch time! Focus on practice exams.",
        tone: "crunch",
      };
    }
    if (daysLeft > 14) {
      return {
        message: "Smooth sailing. Keep your pace.",
        tone: "smooth",
      };
    }
    return {
      message: "Solid window. Lock in and stay consistent.",
      tone: "steady",
    };
  }, [daysLeft]);

  const toneStyles = {
    crunch: {
      border: "border-red-500/30",
      glow: "bg-red-500/10",
      icon: "text-red-400",
      chip: "border-red-500/30 bg-red-500/10 text-red-300",
    },
    smooth: {
      border: "border-emerald-500/30",
      glow: "bg-emerald-500/10",
      icon: "text-emerald-400",
      chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    },
    steady: {
      border: "border-azure-500/30",
      glow: "bg-azure-500/10",
      icon: "text-azure-400",
      chip: "border-azure-500/30 bg-azure-500/10 text-azure-300",
    },
  }[tone];

  const completion =
    totalDays > 0 ? Math.round((doneCount / totalDays) * 100) : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${toneStyles.border} bg-slate-900/60 p-4 backdrop-blur-sm`}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${toneStyles.glow} blur-2xl`}
      />
      <div className="relative flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneStyles.glow}`}
        >
          <Sparkles className={`h-5 w-5 ${toneStyles.icon}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Vibe Check
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneStyles.chip}`}
            >
              {daysLeft} days left
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-100">{message}</p>
        </div>
        <div className="hidden text-right sm:block">
          <span className="text-lg font-bold text-slate-100">{completion}%</span>
          <p className="text-[10px] text-slate-500">done</p>
        </div>
      </div>
    </div>
  );
}
