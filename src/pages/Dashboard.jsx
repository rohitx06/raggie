import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Database, FileText, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentKnowledgeBases } from '../components/dashboard/RecentKnowledgeBases';
import { RecentConversations } from '../components/dashboard/RecentConversations';
import { SkeletonCard } from '../components/ui/Skeleton';
import knowledgeBaseService from '../services/knowledgeBaseService';
import chatbotService from '../services/chatbotService';
import conversationService from '../services/conversationService';
import documentService from '../services/documentService';
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
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back. Here's an overview of your RAG platform.</p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/chatbots/new" className="btn-primary btn-sm">
          <Plus className="w-4 h-4" />
          New Chatbot
        </Link>
        <Link to="/knowledge/new" className="btn-secondary btn-sm">
          <Plus className="w-4 h-4" />
          New Knowledge Base
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse bg-surface-50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Bot} label="Chatbots" value={stats.chatbots} color="emerald" trend="+1 this month" />
          <StatCard icon={Database} label="Knowledge Bases" value={stats.knowledgeBases} color="brand" trend="+2 this week" />
          <StatCard icon={FileText} label="Documents" value={stats.documents} color="blue" trend="+5 today" />
          <StatCard icon={MessageSquare} label="Conversations" value={stats.conversations.toLocaleString()} color="purple" />
        </div>
      )}

      {/* Recent content */}
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

      {/* Getting started */}
      <div className="card p-6 bg-gradient-to-r from-brand-50 to-blue-50 border-brand-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="section-title text-brand-900">Get started with RAG</h2>
            <p className="text-sm text-brand-600 mt-1">
              Create a knowledge base, upload your documents, then build a chatbot grounded in your data.
            </p>
          </div>
          <Link to="/knowledge/new" className="btn-primary btn-sm whitespace-nowrap">
            Start building <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
