import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, FileText, Upload } from 'lucide-react';
import { DocumentUploader } from '../components/knowledge/DocumentUploader';
import { DocumentTable } from '../components/knowledge/DocumentTable';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonTable } from '../components/ui/Skeleton';
import knowledgeBaseService from '../services/knowledgeBaseService';
import documentService from '../services/documentService';

export function Documents() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kb, setKB] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [kbData, docData] = await Promise.all([
        knowledgeBaseService.get(id),
        documentService.list(id),
      ]);
      setKB(kbData);
      setDocs(docData);
    } catch {
      navigate('/knowledge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link to={`/knowledge/${id}`} className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-800 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          {kb ? kb.name : 'Knowledge Base'}
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Upload className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="page-title">Upload Documents</h1>
            <p className="page-subtitle">
              {kb ? `Add documents to "${kb.name}"` : 'Add documents to this knowledge base'}
            </p>
          </div>
        </div>
      </div>

      {/* Uploader */}
      <div className="card p-6">
        <DocumentUploader knowledgeBaseId={id} onUploadComplete={load} />
      </div>

      {/* Document list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">
            Documents
            {!loading && <span className="ml-2 text-sm font-normal text-surface-400">({docs.length})</span>}
          </h2>
          <Link to={`/knowledge/${id}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
            View knowledge base →
          </Link>
        </div>

        {loading ? (
          <SkeletonTable rows={4} />
        ) : docs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Drag and drop files above to get started."
          />
        ) : (
          <DocumentTable documents={docs} onChanged={load} />
        )}
      </div>
    </div>
  );
}
