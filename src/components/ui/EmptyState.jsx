import { cn } from '../../lib/utils';
import { InboxIcon } from 'lucide-react';

export function EmptyState({ icon: Icon = InboxIcon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-surface-400" />
      </div>
      <h3 className="text-sm font-semibold text-surface-700 mb-1">{title}</h3>
      {description && <p className="text-xs text-surface-400 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
