import { useEffect, useState } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export function ReconnectOverlay({ isReconnecting, role, timeoutSeconds = 120 }) {
  const [timeLeft, setTimeLeft] = useState(timeoutSeconds);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timer;
    if (isReconnecting) {
      setShouldShow(true);
      setTimeLeft(timeoutSeconds);
    } else {
      timer = setTimeout(() => {
        setShouldShow(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isReconnecting, timeoutSeconds]);

  useEffect(() => {
    if (!shouldShow) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldShow]);

  if (!shouldShow) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-[30000] bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <WifiOff className="w-6 h-6 text-amber-400 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold tracking-tight text-white">
            {role.toLowerCase() === 'trainer' ? 'Reconnecting Live Session...' : 'Trainer Disconnected'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {role.toLowerCase() === 'trainer'
              ? 'Your connection was interrupted. Restoring live class state...'
              : 'The trainer lost connection. Please wait while connection is being restored.'}
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-5 py-2.5 rounded-lg flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Timeout in</span>
          <span className="text-base font-mono font-bold text-amber-400">
            {minutes}:{seconds}
          </span>
        </div>

        {!isReconnecting && (
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reconnected! Restoring classroom view...</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default ReconnectOverlay;