import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bot, Loader2, Database } from 'lucide-react';
import chatbotService from '../services/chatbotService';
import knowledgeBaseService from '../services/knowledgeBaseService';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../lib/utils';

const MODELS = ['GPT-OSS 120B', 'GPT-OSS 70B', 'Llama 3.1 405B', 'Mixtral 8x7B'];
const PROVIDERS = ['Groq', 'OpenAI', 'Anthropic', 'Together AI'];

export function CreateChatbot() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [kbs, setKBs] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    knowledgeBaseIds: [],
    model: 'GPT-OSS 120B',
    provider: 'Groq',
    temperature: 0.2,
    enableMemory: true,
    strictKnowledgeMode: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    knowledgeBaseService.list().then(setKBs);
  }, []);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const toggleKB = (id) => {
    setForm((f) => ({
      ...f,
      knowledgeBaseIds: f.knowledgeBaseIds.includes(id)
        ? f.knowledgeBaseIds.filter((k) => k !== id)
        : [...f.knowledgeBaseIds, id],
    }));
  };

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
      const bot = await chatbotService.create(form);
      toast({ type: 'success', title: 'Chatbot created', message: `"${bot.name}" is ready to test.` });
      navigate(`/chatbots/${bot.id}`);
    } catch {
      toast({ type: 'error', title: 'Failed to create chatbot' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/chatbots" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-800 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Chatbots
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="page-title">Create Chatbot</h1>
            <p className="page-subtitle">Configure an AI assistant grounded in your knowledge bases.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h2 className="section-title">Basic Information</h2>
          <div>
            <label className="label">Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Customer Support Bot" className={`input ${errors.name ? 'border-red-300' : ''}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What does this chatbot do?" rows={2} className="input resize-none" />
          </div>
        </div>

        {/* Knowledge Bases */}
        <div className="card p-6 space-y-4">
          <div>
            <h2 className="section-title">Knowledge Bases</h2>
            <p className="text-xs text-surface-400 mt-0.5">Select which knowledge bases this chatbot can retrieve from.</p>
          </div>
          {kbs.length === 0 ? (
            <div className="p-4 bg-surface-50 rounded-xl text-sm text-surface-500 text-center">
              No knowledge bases yet. <Link to="/knowledge/new" className="text-brand-600 hover:underline">Create one first.</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {kbs.map((kb) => {
                const checked = form.knowledgeBaseIds.includes(kb.id);
                return (
                  <label
                    key={kb.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                      checked ? 'border-brand-300 bg-brand-50' : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                    )}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggleKB(kb.id)} className="w-4 h-4 rounded accent-brand-600" />
                    <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <Database className="w-3.5 h-3.5 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{kb.name}</p>
                      <p className="text-xs text-surface-400">{kb.documentCount} documents · {kb.storageSize}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Model Config */}
        <div className="card p-6 space-y-5">
          <h2 className="section-title">Model Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Model</label>
              <select value={form.model} onChange={(e) => set('model', e.target.value)} className="input">
                {MODELS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Provider</label>
              <select value={form.provider} onChange={(e) => set('provider', e.target.value)} className="input">
                {PROVIDERS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Temperature: <span className="font-bold text-brand-600">{form.temperature}</span></label>
            <input type="range" min={0} max={1} step={0.1} value={form.temperature} onChange={(e) => set('temperature', parseFloat(e.target.value))} className="w-full accent-brand-600" />
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>0 — Precise</span>
              <span>1 — Creative</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={cn('flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all', form.enableMemory ? 'border-brand-300 bg-brand-50' : 'border-surface-200 hover:bg-surface-50')}>
              <input type="checkbox" checked={form.enableMemory} onChange={(e) => set('enableMemory', e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
              <div>
                <p className="text-sm font-medium text-surface-900">Enable Memory</p>
                <p className="text-xs text-surface-400">Remember conversation context</p>
              </div>
            </label>
            <label className={cn('flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all', form.strictKnowledgeMode ? 'border-brand-300 bg-brand-50' : 'border-surface-200 hover:bg-surface-50')}>
              <input type="checkbox" checked={form.strictKnowledgeMode} onChange={(e) => set('strictKnowledgeMode', e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
              <div>
                <p className="text-sm font-medium text-surface-900">Strict Knowledge Mode</p>
                <p className="text-xs text-surface-400">Only answer from knowledge base</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/chatbots" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : <><Bot className="w-4 h-4" />Create Chatbot</>}
          </button>
        </div>
      </form>
    </div>
  );
}
