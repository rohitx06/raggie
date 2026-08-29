import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/index.js';

import knowledgeBasesRouter from './routes/knowledgeBases.js';
import documentsRouter from './routes/documents.js';
import chatbotsRouter from './routes/chatbots.js';
import chatRouter from './routes/chat.js';
import conversationsRouter from './routes/conversations.js';
import settingsRouter from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Routes
app.use('/api/knowledge-bases', knowledgeBasesRouter);
app.use('/api/knowledge-bases/:kbId/documents', documentsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/chatbots', chatbotsRouter);
app.use('/api/chatbots/:chatbotId', chatRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 RAG Chatbot Platform Backend running on http://localhost:${PORT}`);
});
