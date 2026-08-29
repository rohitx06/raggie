import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, FileText, Upload, Settings, CheckCircle2, Clock, AlertCircle, HardDrive } from 'lucide-react';
import { DocumentTable } from '../components/knowledge/DocumentTable';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonTable } from '../components/ui/Skeleton';
import knowledgeBaseService from '../services/knowledgeBaseService';
import documentService from '../services/documentService';
import { getStatusConfig, formatRelativeTime, cn } from '../lib/utils';

const TABS = ['Overview', 'Documents', 'Settings'];

export function KnowledgeBaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kb, setKB] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overview');

  const load = async () => {
    try {
      const [kbData, docData] = await Promise.all([
        knowledgeBaseService.get(id),
        documentService.list(id),
      ]);
      setKB(kbData);
      setDocs(docData);
    } catch {
      navigate('/knowledge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-surface-200 rounded" />
        <div className="h-4 w-48 bg-surface-200 rounded" />
        <div className="h-40 bg-surface-100 rounded-xl" />
      </div>
    );
  }

  if (!kb) return null;

  const statusCfg = getStatusConfig(kb.status);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link to="/knowledge" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-800 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Knowledge Bases
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold text-surface-900">{kb.name}</h1>
                <span className={statusCfg.className}>{statusCfg.label}</span>
              </div>
              <p className="text-sm text-surface-400 mt-0.5">{kb.description || 'No description'}</p>
              <p className="text-xs text-surface-400 mt-1">Updated {formatRelativeTime(kb.updatedAt)}</p>
            </div>
          </div>
          <Link to={`/knowledge/${id}/documents`} className="btn-primary shrink-0">
            <Upload className="w-4 h-4" />
            Upload Documents
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                tab === t
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: 'Total Documents', value: kb.documentCount, color: 'text-surface-700' },
              { icon: CheckCircle2, label: 'Completed', value: kb.completedCount, color: 'text-emerald-600' },
              { icon: Clock, label: 'Processing', value: kb.processingCount, color: 'text-amber-600' },
              { icon: AlertCircle, label: 'Failed', value: kb.failedCount, color: 'text-red-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card p-4 text-center">
                <Icon className={cn('w-5 h-5 mx-auto mb-2', color)} />
                <p className="text-2xl font-bold text-surface-900">{value}</p>
                <p className="text-xs text-surface-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Configuration */}
          <div className="card p-6">
            <h2 className="section-title mb-4">Retrieval Configuration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Embedding Model', value: kb.embeddingModel },
                { label: 'Retrieval Strategy', value: kb.retrievalStrategy },
                { label: 'Chunking Strategy', value: kb.chunkingStrategy },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-surface-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-surface-800 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Storage */}
          <div className="card p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-surface-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-900">{kb.storageSize}</p>
              <p className="text-xs text-surface-400">Total indexed storage</p>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {tab === 'Documents' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Link to={`/knowledge/${id}/documents`} className="btn-primary btn-sm">
              <Upload className="w-4 h-4" />
              Upload Documents
            </Link>
          </div>
          {docs.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents uploaded"
              description="Upload PDF, DOCX, TXT or Markdown files to start indexing."
              action={<Link to={`/knowledge/${id}/documents`} className="btn-primary btn-sm"><Upload className="w-4 h-4" />Upload Documents</Link>}
            />
          ) : (
            <DocumentTable documents={docs} onChanged={load} />
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'Settings' && (
        <div className="card p-6 space-y-5 max-w-lg">
          <h2 className="section-title">Knowledge Base Settings</h2>
          <div>
            <label className="label">Name</label>
            <input defaultValue={kb.name} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea defaultValue={kb.description} rows={3} className="input resize-none" />
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-700">Settings editing is UI-only in Phase 1. Changes will be persisted once the backend is connected.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
