import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Bot, Search, Filter } from 'lucide-react';
import { formatRelativeTime, cn } from '../lib/utils';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonTable } from '../components/ui/Skeleton';
import conversationService from '../services/conversationService';
import chatbotService from '../services/chatbotService';

export function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([conversationService.list(), chatbotService.list()])
      .then(([convs, bots]) => { setConversations(convs); setChatbots(bots); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = conversations.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.chatbotName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.chatbotId === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Conversations</h1>
        <p className="page-subtitle">Browse all chatbot conversations and view message history.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..." className="input pl-9" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input max-w-xs">
          <option value="all">All Chatbots</option>
          {chatbots.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {loading ? (
        <SkeletonTable rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations found"
          description={search ? 'Try a different search term.' : 'Conversations will appear here after users chat with your chatbots.'}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-surface-100">
            <thead className="bg-surface-50">
              <tr>
                {['Conversation', 'Chatbot', 'Messages', 'Last Active', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 bg-white">
              {filtered.map((conv) => (
                <tr key={conv.id} className="hover:bg-surface-50/60 transition-colors group">
                  <td className="px-5 py-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-900 truncate">{conv.title}</p>
                        <p className="text-xs text-surface-400 truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Bot className="w-3.5 h-3.5 text-surface-400" />
                      <span className="text-sm text-surface-700">{conv.chatbotName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-surface-500 whitespace-nowrap">{conv.messageCount}</td>
                  <td className="px-5 py-4 text-sm text-surface-400 whitespace-nowrap">{formatRelativeTime(conv.updatedAt)}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Link
                      to={`/conversations/${conv.id}`}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-surface-400 text-center">{filtered.length} conversation{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
