import { useEffect, useState } from 'react';

export function ReconnectOverlay({ isReconnecting, role, timeoutSeconds = 120 }) {
  const [timeLeft, setTimeLeft] = useState(timeoutSeconds);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timer;
    if (isReconnecting) {
      setShouldShow(true);
      setTimeLeft(timeoutSeconds);
    } else {
      // 🌟 Keep overlay visible for at least 3 to 5 seconds before hiding
      timer = setTimeout(() => {
        setShouldShow(false);
      }, 3000); // Adjust this number (3000ms = 3 seconds)
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
    <div className="fixed inset-0 z-[30000] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl animate-pulse">
          🔌
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">
            {role.toLowerCase() === 'trainer' ? 'Reconnecting Live Session...' : 'Trainer Disconnected'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {role.toLowerCase() === 'trainer'
              ? 'Your connection was interrupted. Restoring live class state...'
              : 'The trainer lost connection. Please wait while connection is being restored.'}
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Timeout in</span>
          <span className="text-lg font-mono font-black text-amber-400">
            {minutes}:{seconds}
          </span>
        </div>

        {!isReconnecting && (
          <p className="text-xs text-emerald-400 font-bold animate-pulse">
            ✅ Reconnected! Restoring classroom view...
          </p>
        )}
      </div>
    </div>
  );
}

export default ReconnectOverlay;