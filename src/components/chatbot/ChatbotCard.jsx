import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bot, Cpu, Database, MoreHorizontal, MessageSquare, Settings, Trash2, Play, ExternalLink } from 'lucide-react';
import { formatRelativeTime, getStatusConfig, cn } from '../../lib/utils';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';
import chatbotService from '../../services/chatbotService';
import { mockKnowledgeBases } from '../../mock/knowledgeBases';

export function ChatbotCard({ chatbot, onDeleted }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();
  const statusCfg = getStatusConfig(chatbot.status);

  const linkedKBs = mockKnowledgeBases.filter((kb) =>
    chatbot.knowledgeBaseIds?.includes(kb.id)
  );

  async function handleDelete() {
    try {
      await chatbotService.delete(chatbot.id);
      toast({ type: 'success', title: 'Chatbot deleted', message: `"${chatbot.name}" has been removed.` });
      onDeleted?.(chatbot.id);
    } catch {
      toast({ type: 'error', title: 'Delete failed' });
    } finally {
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="card p-5 hover:shadow-card-hover transition-all duration-200 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-surface-900 truncate">{chatbot.name}</h3>
              <p className="text-xs text-surface-400 truncate mt-0.5">{chatbot.description || 'No description'}</p>
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
                    <Link to={`/chatbots/${chatbot.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50">
                      <ExternalLink className="w-3.5 h-3.5 text-surface-400" />
                      View details
                    </Link>
                    <Link to={`/chatbots/${chatbot.id}/test`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50">
                      <Play className="w-3.5 h-3.5 text-surface-400" />
                      Test chatbot
                    </Link>
                    <Link to={`/chatbots/${chatbot.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50">
                      <Settings className="w-3.5 h-3.5 text-surface-400" />
                      Settings
                    </Link>
                    <div className="border-t border-surface-100 mt-1 pt-1">
                      <button onClick={() => { setMenuOpen(false); setConfirmOpen(true); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
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

        {/* Model info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-surface-500 bg-surface-50 px-2.5 py-1.5 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-surface-400" />
            {chatbot.model}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <span className="text-surface-300">via</span>
            <span className="font-medium text-surface-600">{chatbot.provider}</span>
          </div>
        </div>

        {/* Knowledge bases */}
        {linkedKBs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {linkedKBs.map((kb) => (
              <span key={kb.id} className="flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand-700 rounded-md text-xs font-medium">
                <Database className="w-3 h-3" />
                {kb.name}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-surface-400 border-t border-surface-100 pt-3">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {chatbot.totalConversations.toLocaleString()} conversations
          </span>
          <span>·</span>
          <span>Updated {formatRelativeTime(chatbot.updatedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/chatbots/${chatbot.id}/test`} className="btn-primary btn-sm flex-1 justify-center">
            <MessageSquare className="w-3.5 h-3.5" />
            Test
          </Link>
          <Link to={`/chatbots/${chatbot.id}`} className="btn-secondary btn-sm flex-1 justify-center">
            <Settings className="w-3.5 h-3.5" />
            Configure
          </Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${chatbot.name}"?`}
        description="All conversation history for this chatbot will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
