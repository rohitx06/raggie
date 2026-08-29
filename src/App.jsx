import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { KnowledgeBases } from './pages/KnowledgeBases';
import { CreateKnowledgeBase } from './pages/CreateKnowledgeBase';
import { KnowledgeBaseDetails } from './pages/KnowledgeBaseDetails';
import { Documents } from './pages/Documents';
import { Chatbots } from './pages/Chatbots';
import { CreateChatbot } from './pages/CreateChatbot';
import { ChatbotDetails } from './pages/ChatbotDetails';
import { ChatbotTest } from './pages/ChatbotTest';
import { Conversations } from './pages/Conversations';
import { ConversationDetails } from './pages/ConversationDetails';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />

            {/* Knowledge bases */}
            <Route path="/knowledge" element={<KnowledgeBases />} />
            <Route path="/knowledge/new" element={<CreateKnowledgeBase />} />
            <Route path="/knowledge/:id" element={<KnowledgeBaseDetails />} />
            <Route path="/knowledge/:id/documents" element={<Documents />} />

            {/* Chatbots */}
            <Route path="/chatbots" element={<Chatbots />} />
            <Route path="/chatbots/new" element={<CreateChatbot />} />
            <Route path="/chatbots/:id" element={<ChatbotDetails />} />
            <Route path="/chatbots/:id/test" element={<ChatbotTest />} />

            {/* Conversations */}
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/conversations/:id" element={<ConversationDetails />} />

            {/* Settings */}
            <Route path="/settings" element={<Settings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
