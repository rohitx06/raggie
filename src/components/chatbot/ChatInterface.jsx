import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MessageBubble } from './MessageBubble';
import chatbotService from '../../services/chatbotService';
import { useToast } from '../../contexts/ToastContext';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm your AI assistant, grounded in your knowledge base. Ask me anything — I'll answer based on your documents and show you exactly which sources I used.",
  timestamp: new Date().toISOString(),
  sources: [],
};

export function ChatInterface({ chatbot }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { toast } = useToast();

  // Load initial messages for existing chatbot
  useEffect(() => {
    if (!chatbot) return;
    chatbotService.getMessages(chatbot.id).then((msgs) => {
      if (msgs.length > 0) setMessages(msgs);
    });
  }, [chatbot?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const { assistantMessage } = await chatbotService.sendMessage(chatbot.id, text);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      toast({ type: 'error', title: 'Failed to get response', message: 'Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-surface-600" />
            </div>
            <div className="bg-white border border-surface-200 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-surface-200 p-4 bg-white">
        <div className="flex items-end gap-3">
          <button
            onClick={handleClear}
            className="p-2.5 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors shrink-0"
            title="Clear conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question based on your knowledge base..."
              rows={1}
              disabled={loading}
              className={cn(
                'w-full px-4 py-3 pr-12 rounded-xl border border-surface-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow placeholder:text-surface-400 max-h-32',
                loading && 'opacity-60 cursor-not-allowed'
              )}
              style={{ minHeight: '48px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 bottom-2 p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-surface-400 text-center mt-2">
          Responses are grounded in your knowledge base · Press Enter to send
        </p>
      </div>
    </div>
  );
}
