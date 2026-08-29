import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bot, Search } from 'lucide-react';
import { ChatbotCard } from '../components/chatbot/ChatbotCard';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';
import chatbotService from '../services/chatbotService';

export function Chatbots() {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await chatbotService.list();
    setChatbots(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = chatbots.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Chatbots</h1>
          <p className="page-subtitle">Create and manage AI chatbots grounded in your knowledge bases.</p>
        </div>
        <Link to="/chatbots/new" className="btn-primary shrink-0">
          <Plus className="w-4 h-4" />
          New Chatbot
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chatbots..." className="input pl-9" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bot}
          title={search ? 'No results found' : 'No chatbots yet'}
          description={search ? 'Try a different search.' : 'Create your first chatbot and connect it to a knowledge base.'}
          action={!search && <Link to="/chatbots/new" className="btn-primary btn-sm"><Plus className="w-4 h-4" />Create Chatbot</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((bot) => (
            <ChatbotCard key={bot.id} chatbot={bot} onDeleted={load} />
          ))}
        </div>
      )}
    </div>
  );
}
