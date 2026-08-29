import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Database, FileText, MessageSquare, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentKnowledgeBases } from '../components/dashboard/RecentKnowledgeBases';
import { RecentConversations } from '../components/dashboard/RecentConversations';
import { SkeletonCard } from '../components/ui/Skeleton';
import knowledgeBaseService from '../services/knowledgeBaseService';
import chatbotService from '../services/chatbotService';
import conversationService from '../services/conversationService';
import { mockDocuments } from '../mock/documents';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [kbs, setKBs] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    async function load() {
      const [kbList, chatbotList, convList] = await Promise.all([
        knowledgeBaseService.list(),
        chatbotService.list(),
        conversationService.list(),
      ]);
      setKBs(kbList);
      setConversations(convList);
      setStats({
        chatbots: chatbotList.length,
        knowledgeBases: kbList.length,
        documents: mockDocuments.length,
        conversations: convList.length,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Welcome Banner */}
      <div className="card p-8 bg-gradient-to-r from-brand-900 via-indigo-950 to-surface-900 text-white relative overflow-hidden shadow-xl border-none">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-brand-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Linode Cloud & Dify Ready
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">RAG Customer Service Platform</h1>
            <p className="text-sm text-surface-300 leading-relaxed">
              Create AI chatbots, upload domain-specific documents, and deliver grounded, zero-hallucination support powered by Weaviate vector retrieval and Dify LLM orchestration.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/chatbots/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              New Chatbot
            </Link>
            <Link to="/knowledge/new" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm px-4 py-2.5">
              <Plus className="w-4 h-4" />
              New Knowledge Base
            </Link>
          </div>
        </div>
      </div>

      {/* Stats KPI */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 h-28 animate-pulse bg-surface-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={Bot} label="Active Chatbots" value={stats.chatbots} color="emerald" trend="+1 this month" />
          <StatCard icon={Database} label="Knowledge Bases" value={stats.knowledgeBases} color="brand" trend="+2 active" />
          <StatCard icon={FileText} label="Indexed Documents" value={stats.documents} color="blue" trend="+5 processed" />
          <StatCard icon={MessageSquare} label="Conversations" value={stats.conversations.toLocaleString()} color="purple" />
        </div>
      )}

      {/* Recent Activity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <RecentKnowledgeBases knowledgeBases={kbs} />
            <RecentConversations conversations={conversations} />
          </>
        )}
      </div>
    </div>
  );
}
