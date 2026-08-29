import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Database, Loader2 } from 'lucide-react';
import knowledgeBaseService from '../services/knowledgeBaseService';
import { useToast } from '../contexts/ToastContext';

const EMBEDDING_MODELS = ['BGE-small-en-v1.5', 'text-embedding-3-small', 'text-embedding-ada-002'];
const RETRIEVAL_STRATEGIES = ['Hybrid Search', 'Semantic Search', 'Full-text Search'];
const CHUNKING_STRATEGIES = ['Paragraph', 'Fixed Size', 'Sentence', 'Custom'];

export function CreateKnowledgeBase() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    embeddingModel: 'BGE-small-en-v1.5',
    retrievalStrategy: 'Hybrid Search',
    chunkingStrategy: 'Paragraph',
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => { setForm((f) => ({ ...f, [key]: val })); setErrors((e) => ({ ...e, [key]: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const kb = await knowledgeBaseService.create(form);
      toast({ type: 'success', title: 'Knowledge base created', message: `"${kb.name}" is ready for documents.` });
      navigate(`/knowledge/${kb.id}`);
    } catch {
      toast({ type: 'error', title: 'Failed to create', message: 'Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/knowledge" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-800 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledge Bases
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Database className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="page-title">Create Knowledge Base</h1>
            <p className="page-subtitle">Configure a new document collection for RAG retrieval.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h2 className="section-title">Basic Information</h2>

          <div>
            <label className="label">Name <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Customer Support Documentation"
              className={`input ${errors.name ? 'border-red-300 focus:ring-red-400' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe what documents this knowledge base contains..."
              rows={3}
              className="input resize-none"
            />
          </div>
        </div>

        {/* Advanced settings */}
        <div className="card p-6 space-y-5">
          <div>
            <h2 className="section-title">Retrieval Configuration</h2>
            <p className="text-xs text-surface-400 mt-0.5">These settings are passed to Dify when indexing documents.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Embedding Model</label>
              <select value={form.embeddingModel} onChange={(e) => set('embeddingModel', e.target.value)} className="input">
                {EMBEDDING_MODELS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Retrieval Strategy</label>
              <select value={form.retrievalStrategy} onChange={(e) => set('retrievalStrategy', e.target.value)} className="input">
                {RETRIEVAL_STRATEGIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Chunking Strategy</label>
              <select value={form.chunkingStrategy} onChange={(e) => set('chunkingStrategy', e.target.value)} className="input">
                {CHUNKING_STRATEGIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700">
              <strong>Hybrid Search</strong> combines semantic similarity and keyword matching for best retrieval accuracy. Recommended for most use cases.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link to="/knowledge" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : <><Database className="w-4 h-4" />Create Knowledge Base</>}
          </button>
        </div>
      </form>
    </div>
  );
}
