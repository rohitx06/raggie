import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, MessageSquare, Settings, Play, Database, Cpu, Thermometer, Brain, ShieldCheck } from 'lucide-react';
import { getStatusConfig, formatRelativeTime, cn } from '../lib/utils';
import chatbotService from '../services/chatbotService';
import { mockKnowledgeBases } from '../mock/knowledgeBases';

const TABS = ['Overview', 'Settings'];

export function ChatbotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overview');

  useEffect(() => {
    chatbotService.get(id)
      .then(setChatbot)
      .catch(() => navigate('/chatbots'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-surface-200 rounded" />
        <div className="h-40 bg-surface-100 rounded-xl" />
      </div>
    );
  }
  if (!chatbot) return null;

  const statusCfg = getStatusConfig(chatbot.status);
  const linkedKBs = mockKnowledgeBases.filter((kb) => chatbot.knowledgeBaseIds?.includes(kb.id));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link to="/chatbots" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-800 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Chatbots
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold text-surface-900">{chatbot.name}</h1>
                <span className={statusCfg.className}>{statusCfg.label}</span>
              </div>
              <p className="text-sm text-surface-400 mt-0.5">{chatbot.description || 'No description'}</p>
              <p className="text-xs text-surface-400 mt-1">Updated {formatRelativeTime(chatbot.updatedAt)}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link to={`/chatbots/${id}/test`} className="btn-primary btn-sm">
              <Play className="w-4 h-4" />
              Test
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors', tab === t ? 'border-brand-600 text-brand-700' : 'border-transparent text-surface-500 hover:text-surface-700')}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: config */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Conversations', value: chatbot.totalConversations.toLocaleString() },
                { label: 'Avg. Response', value: chatbot.avgResponseTime },
                { label: 'Knowledge Bases', value: linkedKBs.length },
              ].map(({ label, value }) => (
                <div key={label} className="card p-4 text-center">
                  <p className="text-xl font-bold text-surface-900">{value}</p>
                  <p className="text-xs text-surface-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Model config */}
            <div className="card p-5 space-y-4">
              <h2 className="section-title">Model Configuration</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cpu, label: 'Model', value: chatbot.model },
                  { icon: Database, label: 'Provider', value: chatbot.provider },
                  { icon: Thermometer, label: 'Temperature', value: chatbot.temperature },
                  { icon: Brain, label: 'Memory', value: chatbot.enableMemory ? 'Enabled' : 'Disabled' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-surface-500" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-400">{label}</p>
                      <p className="text-sm font-semibold text-surface-900">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {chatbot.strictKnowledgeMode && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-700 font-medium">Strict Knowledge Mode — responses grounded only in your documents</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: linked KBs */}
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="section-title mb-3">Knowledge Bases</h2>
              {linkedKBs.length === 0 ? (
                <p className="text-sm text-surface-400">No knowledge bases linked.</p>
              ) : (
                <div className="space-y-2">
                  {linkedKBs.map((kb) => (
                    <Link key={kb.id} to={`/knowledge/${kb.id}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-50 transition-colors group">
                      <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                        <Database className="w-3.5 h-3.5 text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900 truncate">{kb.name}</p>
                        <p className="text-xs text-surface-400">{kb.documentCount} docs</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to={`/chatbots/${id}/test`} className="btn-primary w-full justify-center">
              <Play className="w-4 h-4" />
              Open Test Chat
            </Link>
          </div>
        </div>
      )}

      {tab === 'Settings' && (
        <div className="card p-6 space-y-5 max-w-lg">
          <h2 className="section-title">Chatbot Settings</h2>
          <div>
            <label className="label">Name</label>
            <input defaultValue={chatbot.name} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea defaultValue={chatbot.description} rows={2} className="input resize-none" />
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-700">Settings editing is UI-only in Phase 1.</p>
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
