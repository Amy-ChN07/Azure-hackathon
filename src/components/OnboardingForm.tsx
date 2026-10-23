import { useState } from "react";
import { Calendar, Clock, Sparkles, Check } from "lucide-react";
import { WEAK_AREAS } from "../syllabus";
import type { WeakAreaId, PlanConfig } from "../types";

interface OnboardingFormProps {
  onGenerate: (config: PlanConfig) => void;
}

export function OnboardingForm({ onGenerate }: OnboardingFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [weakAreas, setWeakAreas] = useState<WeakAreaId[]>([]);
  const [error, setError] = useState("");

  const toggleArea = (id: WeakAreaId) => {
    setWeakAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (!examDate) {
      setError("Please pick your exam date.");
      return;
    }
    if (weakAreas.length === 0) {
      setError("Select at least one weak area to focus on.");
      return;
    }
    setError("");
    onGenerate({ examDate, dailyHours, weakAreas });
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-azure-500/10 blur-3xl" />
      <div className="relative">
        <h2 className="text-lg font-semibold text-slate-100 sm:text-xl">
          Set up your study plan
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Tell us when your exam is and where you struggle — we'll do the rest.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Calendar className="h-4 w-4 text-azure-400" />
              Exam Date
            </label>
            <input
              type="date"
              min={today}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-azure-500 focus:ring-2 focus:ring-azure-500/30 [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Clock className="h-4 w-4 text-azure-400" />
              Daily Study Hours
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={dailyHours}
              onChange={(e) =>
                setDailyHours(
                  Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-azure-500 focus:ring-2 focus:ring-azure-500/30"
            />
          </div>
        </div>

        <div className="mt-5">
          <span className="mb-2 block text-sm font-medium text-slate-300">
            Weak Areas
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {WEAK_AREAS.map((area) => {
              const checked = weakAreas.includes(area.id);
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleArea(area.id)}
                  className={`relative flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm transition ${
                    checked
                      ? "border-azure-500/60 bg-azure-500/10 text-slate-100 shadow-lg shadow-azure-500/10"
                      : "border-slate-700 bg-slate-950/40 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      checked
                        ? "border-azure-500 bg-azure-500 text-white"
                        : "border-slate-600 bg-transparent"
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className="font-medium leading-tight">{area.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-azure-500 to-azure-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-azure-500/25 transition hover:from-azure-400 hover:to-azure-500 hover:shadow-azure-500/40 sm:w-auto sm:px-8"
        >
          <Sparkles className="h-5 w-5 transition group-hover:scale-110" />
          Generate My Study Plan
        </button>
      </div>
    </section>
  );
}
