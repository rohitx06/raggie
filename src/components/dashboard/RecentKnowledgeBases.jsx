import { Link } from 'react-router-dom';
import { Database, FileText, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

export function RecentKnowledgeBases({ knowledgeBases }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
        <h2 className="section-title">Recent Knowledge Bases</h2>
        <Link
          to="/knowledge"
          className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-surface-50">
        {knowledgeBases.slice(0, 4).map((kb) => (
          <Link
            key={kb.id}
            to={`/knowledge/${kb.id}`}
            className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
              <Database className="w-4 h-4 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">{kb.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-surface-400">
                  <FileText className="w-3 h-3" />
                  {kb.documentCount} documents
                </span>
                <span className="text-xs text-surface-300">·</span>
                <span className="text-xs text-surface-400">Updated {formatRelativeTime(kb.updatedAt)}</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-surface-500 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
