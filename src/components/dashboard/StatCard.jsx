import { cn } from '../../lib/utils';
import { TrendingUp } from 'lucide-react';

export function StatCard({ icon: Icon, label, value, color = 'brand', trend }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    purple: 'bg-purple-50 text-purple-600 ring-purple-100',
  };

  return (
    <div className="card-interactive p-6 relative overflow-hidden group">
      {/* Background glow accent */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-brand-50/50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-extrabold text-surface-900 mt-2 tracking-tight group-hover:scale-105 transition-transform duration-200 origin-left">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center ring-1 group-hover:rotate-6 transition-all duration-300 shadow-sm', colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
