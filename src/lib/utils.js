import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

export function getStatusConfig(status) {
  const configs = {
    completed: { label: 'Completed', className: 'badge-green', dot: 'bg-emerald-500' },
    processing: { label: 'Processing', className: 'badge-yellow', dot: 'bg-amber-500' },
    failed: { label: 'Failed', className: 'badge-red', dot: 'bg-red-500' },
    queued: { label: 'Queued', className: 'badge-gray', dot: 'bg-surface-400' },
    active: { label: 'Active', className: 'badge-green', dot: 'bg-emerald-500' },
    draft: { label: 'Draft', className: 'badge-gray', dot: 'bg-surface-400' },
    ready: { label: 'Ready', className: 'badge-green', dot: 'bg-emerald-500' },
    error: { label: 'Error', className: 'badge-red', dot: 'bg-red-500' },
  };
  return configs[status] || { label: status, className: 'badge-gray', dot: 'bg-surface-400' };
}

export const FILE_TYPE_COLORS = {
  PDF: 'text-red-600 bg-red-50',
  DOCX: 'text-blue-600 bg-blue-50',
  TXT: 'text-surface-600 bg-surface-100',
  MD: 'text-purple-600 bg-purple-50',
  CSV: 'text-emerald-600 bg-emerald-50',
  HTML: 'text-orange-600 bg-orange-50',
};
