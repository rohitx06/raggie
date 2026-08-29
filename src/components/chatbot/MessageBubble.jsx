import { cn, formatDate } from '../../lib/utils';
import { Bot, User } from 'lucide-react';
import { SourceCitation } from './SourceCitation';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 animate-slide-up', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
          isUser ? 'bg-brand-100' : 'bg-surface-100'
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-brand-600" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-surface-600" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'bg-brand-600 text-white rounded-tr-sm'
              : 'bg-white border border-surface-200 text-surface-800 rounded-tl-sm'
          )}
        >
          {/* Simple markdown-like rendering */}
          {message.content.split('\n').map((line, i) => {
            // Bold text: **text**
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                {parts.map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )}
              </p>
            );
          })}
        </div>
        <p className={cn('text-xs text-surface-400 mt-1 px-1', isUser ? 'text-right' : 'text-left')}>
          {formatDate(message.timestamp)}
        </p>
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceCitation sources={message.sources} />
        )}
      </div>
    </div>
  );
}
