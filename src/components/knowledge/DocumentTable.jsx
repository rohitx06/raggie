import { useState } from 'react';
import { Trash2, RefreshCw, MoreHorizontal } from 'lucide-react';
import { formatRelativeTime, getStatusConfig, FILE_TYPE_COLORS, cn } from '../../lib/utils';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';
import documentService from '../../services/documentService';

function StatusBadge({ status }) {
  const cfg = getStatusConfig(status);
  return (
    <span className={cfg.className}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
}

export function DocumentTable({ documents, onChanged }) {
  const [confirmId, setConfirmId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const { toast } = useToast();

  const docToDelete = documents.find((d) => d.id === confirmId);

  async function handleDelete() {
    try {
      await documentService.delete(confirmId);
      toast({ type: 'success', title: 'Document deleted' });
      onChanged?.();
    } catch {
      toast({ type: 'error', title: 'Delete failed' });
    } finally {
      setConfirmId(null);
    }
  }

  async function handleReprocess(id, name) {
    try {
      await documentService.reprocess(id);
      toast({ type: 'info', title: 'Reprocessing started', message: `"${name}" has been queued.` });
      onChanged?.();
    } catch {
      toast({ type: 'error', title: 'Reprocess failed' });
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-surface-200">
        <table className="min-w-full divide-y divide-surface-100">
          <thead className="bg-surface-50">
            <tr>
              {['Document', 'Type', 'Size', 'Status', 'Uploaded', ''].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50 bg-white">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-surface-50/60 transition-colors group">
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-sm font-medium text-surface-900 truncate">{doc.name}</p>
                  {doc.error && <p className="text-xs text-red-500 mt-0.5 truncate">{doc.error}</p>}
                  {doc.chunkCount > 0 && (
                    <p className="text-xs text-surface-400 mt-0.5">{doc.chunkCount} chunks indexed</p>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={cn('px-2 py-0.5 rounded text-xs font-semibold', FILE_TYPE_COLORS[doc.type] || 'bg-surface-100 text-surface-600')}>
                    {doc.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-surface-500 whitespace-nowrap">{doc.size}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3 text-sm text-surface-400 whitespace-nowrap">
                  {formatRelativeTime(doc.uploadedAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.status === 'failed' && (
                      <button
                        onClick={() => handleReprocess(doc.id, doc.name)}
                        className="p-1.5 rounded-md text-surface-400 hover:bg-surface-100 hover:text-brand-600 transition-colors"
                        title="Retry processing"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmId(doc.id)}
                      className="p-1.5 rounded-md text-surface-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title={`Delete "${docToDelete?.name}"?`}
        description="This document and all its indexed chunks will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
