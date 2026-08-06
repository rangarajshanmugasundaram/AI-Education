import { useNavigate } from 'react-router-dom';

const formatNumber = (val) => new Intl.NumberFormat('en-IN').format(Number(val) || 0);

export default function AdminKpiCard({ title, value, icon: IconComponent, route }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => route && navigate(route)}
      className={`p-4 border border-slate-200/80 rounded-xl bg-white shadow-xs flex items-center justify-between gap-4 transition-all hover:border-slate-300 ${
        route ? 'cursor-pointer' : ''
      }`}
    >
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <h3 className="text-xl font-bold font-mono text-slate-900">{formatNumber(value)}</h3>
      </div>
      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 shrink-0">
        <IconComponent className="w-5 h-5 text-slate-600" />
      </div>
    </div>
  );
}