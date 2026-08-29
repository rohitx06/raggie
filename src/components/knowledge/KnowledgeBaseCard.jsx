import { Link } from 'react-router-dom';
import { Database, FileText, MoreHorizontal, Upload, ExternalLink, Trash2, Settings, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { formatRelativeTime, getStatusConfig, cn } from '../../lib/utils';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';
import knowledgeBaseService from '../../services/knowledgeBaseService';

export function KnowledgeBaseCard({ kb, onDeleted }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const statusCfg = getStatusConfig(kb.status);

  async function handleDelete() {
    setDeleting(true);
    try {
      await knowledgeBaseService.delete(kb.id);
      toast({ type: 'success', title: 'Knowledge base deleted', message: `"${kb.name}" has been removed.` });
      onDeleted?.(kb.id);
    } catch {
      toast({ type: 'error', title: 'Delete failed', message: 'Please try again.' });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="card-interactive p-6 flex flex-col justify-between gap-5 group">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-50 to-indigo-100/80 border border-brand-200/50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <Database className="w-5 h-5 text-brand-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-surface-900 truncate group-hover:text-brand-600 transition-colors">{kb.name}</h3>
                <p className="text-xs text-surface-400 truncate mt-0.5">{kb.description || 'No description'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={statusCfg.className}>{statusCfg.label}</span>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1.5 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl border border-surface-200 shadow-xl z-20 py-1.5 animate-scale-in">
                      <Link
                        to={`/knowledge/${kb.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-surface-700 hover:bg-surface-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-surface-400" />
                        View details
                      </Link>
                      <Link
                        to={`/knowledge/${kb.id}/documents`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-surface-700 hover:bg-surface-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-surface-400" />
                        Upload documents
                      </Link>
                      <div className="border-t border-surface-100 mt-1 pt-1">
                        <button
                          onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-surface-50/80 rounded-xl p-3 text-center border border-surface-100">
              <p className="text-lg font-extrabold text-surface-900">{kb.documentCount}</p>
              <p className="text-[11px] font-medium text-surface-400 mt-0.5">Documents</p>
            </div>
            <div className="bg-surface-50/80 rounded-xl p-3 text-center border border-surface-100">
              <p className="text-lg font-extrabold text-surface-900">{kb.storageSize}</p>
              <p className="text-[11px] font-medium text-surface-400 mt-0.5">Size</p>
            </div>
            <div className="bg-surface-50/80 rounded-xl p-3 text-center border border-surface-100">
              <p className="text-lg font-extrabold text-emerald-600">{kb.completedCount}</p>
              <p className="text-[11px] font-medium text-surface-400 mt-0.5">Indexed</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-100/80">
          <span className="text-xs font-medium text-surface-400">Updated {formatRelativeTime(kb.updatedAt)}</span>
          <div className="flex gap-2">
            <Link
              to={`/knowledge/${kb.id}/documents`}
              className="btn btn-sm bg-surface-100 text-surface-700 hover:bg-surface-200"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </Link>
            <Link
              to={`/knowledge/${kb.id}`}
              className="btn-primary btn-sm"
            >
              Open <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${kb.name}"?`}
        description="This will permanently delete the knowledge base and all its documents from your system."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
