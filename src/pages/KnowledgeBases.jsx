import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Database, Search } from 'lucide-react';
import { KnowledgeBaseCard } from '../components/knowledge/KnowledgeBaseCard';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';
import knowledgeBaseService from '../services/knowledgeBaseService';

export function KnowledgeBases() {
  const [kbs, setKBs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await knowledgeBaseService.list();
    setKBs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = kbs.filter((kb) =>
    kb.name.toLowerCase().includes(search.toLowerCase()) ||
    (kb.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Knowledge Bases</h1>
          <p className="page-subtitle">Manage your document collections for RAG retrieval.</p>
        </div>
        <Link to="/knowledge/new" className="btn-primary shrink-0">
          <Plus className="w-4 h-4" />
          New Knowledge Base
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search knowledge bases..."
          className="input pl-9"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Database}
          title={search ? 'No results found' : 'No knowledge bases yet'}
          description={search ? 'Try a different search term.' : 'Create your first knowledge base to start building your chatbot.'}
          action={!search && <Link to="/knowledge/new" className="btn-primary btn-sm"><Plus className="w-4 h-4" />Create Knowledge Base</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((kb) => (
            <KnowledgeBaseCard key={kb.id} kb={kb} onDeleted={load} />
          ))}
        </div>
      )}
    </div>
  );
}
