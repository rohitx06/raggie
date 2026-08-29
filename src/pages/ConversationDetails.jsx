import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Download, Trash2 } from 'lucide-react';
import { MessageBubble } from '../components/chatbot/MessageBubble';
import conversationService from '../services/conversationService';
import { formatDate } from '../lib/utils';

export function ConversationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      conversationService.get(id),
      conversationService.getMessages(id),
    ])
      .then(([conv, msgs]) => { setConversation(conv); setMessages(msgs); })
      .catch(() => navigate('/conversations'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-surface-200 rounded" />
        <div className="h-96 bg-surface-100 rounded-xl" />
      </div>
    );
  }
  if (!conversation) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link to="/conversations" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-800 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Conversations
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="page-title">{conversation.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-sm text-surface-500">
                <Bot className="w-3.5 h-3.5" />
                {conversation.chatbotName}
              </div>
              <span className="text-surface-300">·</span>
              <span className="text-sm text-surface-400">{conversation.messageCount} messages</span>
              <span className="text-surface-300">·</span>
              <span className="text-sm text-surface-400">{formatDate(conversation.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="card p-6 space-y-6">
        {messages.length === 0 ? (
          <p className="text-sm text-surface-400 text-center py-8">No messages in this conversation.</p>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
      </div>
    </div>
  );
}
