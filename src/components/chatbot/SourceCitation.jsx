import { FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export function SourceCitation({ sources }) {
  const [expanded, setExpanded] = useState(true);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 border border-surface-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-50 hover:bg-surface-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
            <FileText className="w-3 h-3 text-emerald-600" />
          </div>
          <span className="text-xs font-semibold text-surface-600">
            Sources ({sources.length})
          </span>
          <span className="text-xs text-surface-400">— Answer grounded in knowledge base</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-surface-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
        )}
      </button>
      {expanded && (
        <div className="divide-y divide-surface-100">
          {sources.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-white">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-surface-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-surface-800">{s.document}</p>
                  {s.page && <p className="text-xs text-surface-400">Page {s.page}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', s.relevance >= 0.9 ? 'bg-emerald-500' : s.relevance >= 0.7 ? 'bg-amber-400' : 'bg-surface-300')}
                    style={{ width: `${Math.round(s.relevance * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-surface-500 font-medium w-8 text-right">
                  {Math.round(s.relevance * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
