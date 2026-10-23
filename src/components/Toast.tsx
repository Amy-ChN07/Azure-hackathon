import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string;
  show: boolean;
}

export function Toast({ message, show }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-azure-500/40 bg-slate-900/95 px-5 py-3.5 shadow-2xl shadow-azure-500/20 backdrop-blur">
        <CheckCircle2 className="h-5 w-5 text-azure-400" />
        <span className="text-sm font-medium text-slate-100">{message}</span>
      </div>
    </div>
  );
}
