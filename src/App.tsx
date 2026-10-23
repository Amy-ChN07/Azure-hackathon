import { useCallback, useState } from "react";
import { Cloud, BookOpen, Sparkles, Info } from "lucide-react";
import type { PlanConfig, StudySprint } from "./types";
import { generatePlan } from "./planner";
import { OnboardingForm } from "./components/OnboardingForm";
import { StudyPlan } from "./components/StudyPlan";
import { Toast } from "./components/Toast";

function App() {
  const [plan, setPlan] = useState<PlanConfig | null>(null);
  const [sprints, setSprints] = useState<StudySprint[]>([]);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState(false);

  const handleGenerate = useCallback((config: PlanConfig) => {
    setPlan(config);
    setSprints(generatePlan(config));
    setCompleted({});
  }, []);

  const handleToggle = useCallback((day: number) => {
    setCompleted((prev) => ({ ...prev, [day]: !prev[day] }));
  }, []);

  const handleShare = useCallback(() => {
    setToast(true);
    window.setTimeout(() => setToast(false), 2500);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-azure-600/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-azure-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-azure-400 to-azure-600 shadow-lg shadow-azure-500/30">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">
                AZ-900 Vibe Planner
              </h1>
              <p className="text-xs text-slate-400">
                Your smart path to Azure Fundamentals
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Info className="h-3.5 w-3.5" />
            Unofficial Study Tool
          </span>
        </header>

        {/* Onboarding */}
        {!plan && (
          <div className="mb-6">
            <OnboardingForm onGenerate={handleGenerate} />
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-azure-400" />
              <p className="text-sm text-slate-400">
                This tool turns your exam date, daily study hours, and weak areas
                into a day-by-day study plan — each sprint comes with a practical,
                real-world African example to make the concepts stick.
              </p>
            </div>
          </div>
        )}

        {/* Study plan output */}
        {plan && (
          <StudyPlan
            config={plan}
            sprints={sprints}
            completed={completed}
            onToggle={handleToggle}
            onShare={handleShare}
          />
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-azure-500" />
            <p>
              This is an unofficial study tool and is not affiliated with
              Microsoft. Content based on the AZ-900 skills outline.
            </p>
          </div>
        </footer>
      </div>

      <Toast message="Plan copied to clipboard!" show={toast} />
    </div>
  );
}

export default App;
