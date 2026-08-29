import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bot, Cpu, Database, MoreHorizontal, MessageSquare, Settings, Trash2, Play, ExternalLink, Sparkles } from 'lucide-react';
import { formatRelativeTime, getStatusConfig } from '../../lib/utils';
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
      <div className="card-interactive p-6 flex flex-col justify-between gap-5 group">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-surface-900 truncate group-hover:text-brand-600 transition-colors">{chatbot.name}</h3>
                <p className="text-xs text-surface-400 truncate mt-0.5">{chatbot.description || 'No description'}</p>
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
                      <Link to={`/chatbots/${chatbot.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-surface-700 hover:bg-surface-50">
                        <ExternalLink className="w-3.5 h-3.5 text-surface-400" />
                        View details
                      </Link>
                      <Link to={`/chatbots/${chatbot.id}/test`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-surface-700 hover:bg-surface-50">
                        <Play className="w-3.5 h-3.5 text-surface-400" />
                        Test chatbot
                      </Link>
                      <div className="border-t border-surface-100 mt-1 pt-1">
                        <button onClick={() => { setMenuOpen(false); setConfirmOpen(true); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
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

          {/* Model info */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-surface-600 bg-surface-100/80 border border-surface-200/60 px-3 py-1 rounded-xl">
              <Cpu className="w-3.5 h-3.5 text-brand-500" />
              {chatbot.model}
            </div>
            <div className="flex items-center gap-1 text-xs text-surface-400">
              <span>via</span>
              <span className="font-semibold text-surface-700">{chatbot.provider}</span>
            </div>
          </div>

          {/* Knowledge bases */}
          {linkedKBs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {linkedKBs.map((kb) => (
                <span key={kb.id} className="flex items-center gap-1 px-2.5 py-1 bg-brand-50/80 border border-brand-200/50 text-brand-700 rounded-lg text-xs font-semibold">
                  <Database className="w-3 h-3 text-brand-600" />
                  {kb.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        <div className="space-y-3 pt-3 border-t border-surface-100/80">
          <div className="flex items-center justify-between text-xs text-surface-400 font-medium">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-surface-400" />
              {chatbot.totalConversations.toLocaleString()} chats
            </span>
            <span>Updated {formatRelativeTime(chatbot.updatedAt)}</span>
          </div>

          <div className="flex gap-2">
            <Link to={`/chatbots/${chatbot.id}/test`} className="btn-primary btn-sm flex-1 justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              Test Bot
            </Link>
            <Link to={`/chatbots/${chatbot.id}`} className="btn-secondary btn-sm flex-1 justify-center">
              <Settings className="w-3.5 h-3.5" />
              Configure
            </Link>
          </div>
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
