import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, executeInsert, executeUpdate } from '../db/index.js';
import { difyService } from '../services/difyService.js';

const router = express.Router({ mergeParams: true });

// GET /api/chatbots/:chatbotId/messages
router.get('/messages', async (req, res) => {
  try {
    const { chatbotId } = req.params;
    const conv = await queryOne('conversations', (c) => c.chatbot_id === chatbotId);
    if (!conv) return res.json([]);

    const msgs = await queryAll('messages', (m) => m.conversation_id === conv.id);
    const formatted = msgs.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      sources: m.sources ? JSON.parse(m.sources) : [],
      timestamp: m.timestamp,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chatbots/:chatbotId/chat
router.post('/chat', async (req, res) => {
  try {
    const { chatbotId } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const bot = await queryOne('chatbots', (b) => b.id === chatbotId);
    if (!bot) return res.status(404).json({ error: 'Chatbot not found' });

    const now = new Date().toISOString();

    // Find or create conversation
    let conv = await queryOne('conversations', (c) => c.chatbot_id === chatbotId);
    if (!conv) {
      conv = {
        id: `conv-${uuidv4().slice(0, 8)}`,
        chatbot_id: chatbotId,
        chatbot_name: bot.name,
        dify_conversation_id: null,
        title: message.length > 35 ? `${message.slice(0, 35)}...` : message,
        last_message: message,
        message_count: 0,
        created_at: now,
        updated_at: now,
      };
      await executeInsert('conversations', conv);
    }

    // Save User message
    const userMsgId = `msg-${uuidv4().slice(0, 8)}`;
    const userMsg = {
      id: userMsgId,
      conversation_id: conv.id,
      role: 'user',
      content: message,
      sources: null,
      timestamp: now,
    };
    await executeInsert('messages', userMsg);

    // Call Dify API for Chat Completion & Grounded Sources
    const difyRes = await difyService.sendChatMessage({
      query: message,
      conversationId: conv.dify_conversation_id,
      apiKey: bot.dify_api_key,
    });

    const sources = (difyRes.metadata?.retrieval_resources || []).map((r) => ({
      document: r.document_name || 'Knowledge Base Document',
      relevance: r.score ? Number(r.score.toFixed(2)) : 0.85,
      page: r.page || null,
    }));

    // Save Assistant message
    const assistantMsgId = `msg-${uuidv4().slice(0, 8)}`;
    const assistantMsg = {
      id: assistantMsgId,
      conversation_id: conv.id,
      role: 'assistant',
      content: difyRes.answer || 'Thank you for your question.',
      sources: JSON.stringify(sources),
      timestamp: new Date().toISOString(),
    };
    await executeInsert('messages', assistantMsg);

    // Update conversation metadata
    await executeUpdate('conversations', conv.id, {
      last_message: difyRes.answer || message,
      message_count: (conv.message_count || 0) + 2,
      dify_conversation_id: difyRes.conversation_id || conv.dify_conversation_id,
      updated_at: new Date().toISOString(),
    });

    // Update chatbot stats
    await executeUpdate('chatbots', bot.id, {
      total_conversations: (bot.total_conversations || 0) + 1,
      updated_at: new Date().toISOString(),
    });

    res.json({
      userMessage: {
        id: userMsg.id,
        role: userMsg.role,
        content: userMsg.content,
        timestamp: userMsg.timestamp,
      },
      assistantMessage: {
        id: assistantMsg.id,
        role: assistantMsg.role,
        content: assistantMsg.content,
        sources,
        timestamp: assistantMsg.timestamp,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
