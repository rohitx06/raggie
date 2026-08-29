import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Database, ShieldCheck, Settings } from 'lucide-react';
import { ChatInterface } from '../components/chatbot/ChatInterface';
import chatbotService from '../services/chatbotService';
import { mockKnowledgeBases } from '../mock/knowledgeBases';

export function ChatbotTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    chatbotService.get(id)
      .then(setChatbot)
      .catch(() => navigate('/chatbots'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!chatbot) return null;

  const linkedKBs = mockKnowledgeBases.filter((kb) => chatbot.knowledgeBaseIds?.includes(kb.id));

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-2rem)] -m-6 sm:-m-6 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to={`/chatbots/${id}`}
            className="p-1.5 rounded-md text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900">{chatbot.name}</p>
            <p className="text-xs text-surface-400">{chatbot.model} · {chatbot.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {chatbot.strictKnowledgeMode && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs text-emerald-700 font-medium">Grounded</span>
            </div>
          )}
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-hidden bg-surface-50">
          <ChatInterface chatbot={chatbot} />
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="hidden lg:flex flex-col w-64 border-l border-surface-200 bg-white overflow-y-auto shrink-0">
            <div className="p-4 border-b border-surface-100">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Configuration</p>
            </div>
            <div className="p-4 space-y-4 text-sm">
              <div>
                <p className="text-xs text-surface-400 mb-1">Model</p>
                <p className="font-medium text-surface-800">{chatbot.model}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Provider</p>
                <p className="font-medium text-surface-800">{chatbot.provider}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Temperature</p>
                <p className="font-medium text-surface-800">{chatbot.temperature}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Memory</p>
                <p className="font-medium text-surface-800">{chatbot.enableMemory ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Strict Mode</p>
                <p className="font-medium text-surface-800">{chatbot.strictKnowledgeMode ? 'Yes' : 'No'}</p>
              </div>
              <div className="border-t border-surface-100 pt-4">
                <p className="text-xs text-surface-400 mb-2">Knowledge Bases ({linkedKBs.length})</p>
                {linkedKBs.map((kb) => (
                  <div key={kb.id} className="flex items-center gap-2 py-1.5">
                    <Database className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span className="text-xs text-surface-700 truncate">{kb.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
