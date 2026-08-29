import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';
import { cn, getFileExtension, FILE_TYPE_COLORS } from '../../lib/utils';
import documentService from '../../services/documentService';
import { useToast } from '../../contexts/ToastContext';

const SUPPORTED_FORMATS = ['pdf', 'docx', 'txt', 'md', 'csv', 'html'];
const MAX_FILE_SIZE_MB = 50;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function DocumentUploader({ knowledgeBaseId, onUploadComplete }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file) => {
    const ext = getFileExtension(file.name);
    if (!SUPPORTED_FORMATS.includes(ext)) {
      return `Unsupported format (.${ext})`;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File exceeds ${MAX_FILE_SIZE_MB}MB limit`;
    }
    return null;
  };

  const addFiles = useCallback((newFiles) => {
    const validated = Array.from(newFiles).map((file) => {
      const error = validateFile(file);
      return {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: formatBytes(file.size),
        ext: getFileExtension(file.name).toUpperCase(),
        status: error ? 'error' : 'pending',
        progress: 0,
        error,
      };
    });
    setFiles((prev) => [...prev, ...validated]);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleFileInput = (e) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    const toUpload = files.filter((f) => f.status === 'pending');
    if (!toUpload.length) return;

    setUploading(true);
    setFiles((prev) =>
      prev.map((f) => (f.status === 'pending' ? { ...f, status: 'uploading', progress: 0 } : f))
    );

    try {
      await documentService.upload(
        knowledgeBaseId,
        toUpload.map((f) => f.file),
        (fileIndex, percent) => {
          const id = toUpload[fileIndex]?.id;
          if (id) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === id ? { ...f, progress: percent, status: percent === 100 ? 'processing' : 'uploading' } : f
              )
            );
          }
        }
      );

      setFiles((prev) =>
        prev.map((f) => (f.status === 'processing' || f.status === 'uploading' ? { ...f, status: 'done' } : f))
      );

      toast({ type: 'success', title: 'Upload complete', message: `${toUpload.length} file(s) sent for processing.` });
      onUploadComplete?.();
    } catch {
      toast({ type: 'error', title: 'Upload failed', message: 'Some files could not be uploaded.' });
    } finally {
      setUploading(false);
    }
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;

  const statusIcon = (f) => {
    if (f.status === 'done') return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    if (f.status === 'error') return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
    if (f.status === 'uploading' || f.status === 'processing') return <Loader2 className="w-4 h-4 text-brand-500 shrink-0 animate-spin" />;
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200',
          dragging
            ? 'border-brand-400 bg-brand-50 scale-[1.01]'
            : 'border-surface-200 bg-surface-50 hover:border-brand-300 hover:bg-brand-50/40'
        )}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv,.html"
          onChange={handleFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center transition-colors', dragging ? 'bg-brand-100' : 'bg-white border border-surface-200')}>
            <Upload className={cn('w-6 h-6', dragging ? 'text-brand-600' : 'text-surface-400')} />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-700">
              {dragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-surface-400 mt-1">or click to browse your computer</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['PDF', 'DOCX', 'TXT', 'MD', 'CSV', 'HTML'].map((fmt) => (
              <span key={fmt} className="px-2 py-0.5 bg-white border border-surface-200 rounded text-xs text-surface-500 font-medium">
                {fmt}
              </span>
            ))}
          </div>
          <p className="text-xs text-surface-400">Max {MAX_FILE_SIZE_MB}MB per file</p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 bg-white rounded-xl border border-surface-200 px-4 py-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0', FILE_TYPE_COLORS[f.ext] || 'bg-surface-100 text-surface-600')}>
                {f.ext.slice(0, 3)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-surface-900 truncate">{f.name}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusIcon(f)}
                    <span className="text-xs text-surface-400">{f.size}</span>
                    {(f.status === 'pending' || f.status === 'error') && (
                      <button onClick={() => removeFile(f.id)} className="text-surface-400 hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {f.error && <p className="text-xs text-red-500 mt-0.5">{f.error}</p>}
                {(f.status === 'uploading') && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-surface-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-300"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-surface-400 mt-0.5">{f.progress}%</p>
                  </div>
                )}
                {f.status === 'processing' && <p className="text-xs text-amber-600 mt-0.5">Processing...</p>}
                {f.status === 'done' && <p className="text-xs text-emerald-600 mt-0.5">Uploaded successfully</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {pendingCount > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload {pendingCount} file{pendingCount > 1 ? 's' : ''}
            </>
          )}
        </button>
      )}
    </div>
  );
}
