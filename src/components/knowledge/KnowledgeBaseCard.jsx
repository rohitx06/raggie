import { Link } from 'react-router-dom';
import { Database, FileText, HardDrive, MoreHorizontal, Upload, ExternalLink, Trash2, Settings } from 'lucide-react';
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
      <div className="card p-5 hover:shadow-card-hover transition-all duration-200 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-brand-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-surface-900 truncate">{kb.name}</h3>
              <p className="text-xs text-surface-400 truncate mt-0.5">{kb.description || 'No description'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={statusCfg.className}>{statusCfg.label}</span>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1.5 rounded-md text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-surface-200 shadow-lg z-20 py-1 animate-fade-in">
                    <Link
                      to={`/knowledge/${kb.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-surface-400" />
                      View details
                    </Link>
                    <Link
                      to={`/knowledge/${kb.id}/documents`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                    >
                      <Upload className="w-3.5 h-3.5 text-surface-400" />
                      Upload documents
                    </Link>
                    <Link
                      to={`/knowledge/${kb.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                    >
                      <Settings className="w-3.5 h-3.5 text-surface-400" />
                      Settings
                    </Link>
                    <div className="border-t border-surface-100 mt-1 pt-1">
                      <button
                        onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-surface-50 rounded-lg p-2.5">
            <p className="text-base font-bold text-surface-900">{kb.documentCount}</p>
            <p className="text-xs text-surface-400 mt-0.5">Documents</p>
          </div>
          <div className="bg-surface-50 rounded-lg p-2.5">
            <p className="text-base font-bold text-surface-900">{kb.storageSize}</p>
            <p className="text-xs text-surface-400 mt-0.5">Storage</p>
          </div>
          <div className="bg-surface-50 rounded-lg p-2.5">
            <p className="text-base font-bold text-surface-900">{kb.completedCount}</p>
            <p className="text-xs text-surface-400 mt-0.5">Indexed</p>
          </div>
        </div>

        {/* Processing bar */}
        {kb.processingCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-soft" />
            {kb.processingCount} document{kb.processingCount > 1 ? 's' : ''} processing...
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-surface-400">Updated {formatRelativeTime(kb.updatedAt)}</span>
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
              Open
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${kb.name}"?`}
        description="This will permanently delete the knowledge base and all its documents. This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
