import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, executeInsert, executeUpdate, executeDelete } from '../db/index.js';
import { difyService } from '../services/difyService.js';

const router = express.Router();

// GET /api/conversations
router.get('/', async (req, res) => {
  try {
    const { chatbotId } = req.query;
    const convs = chatbotId
      ? await queryAll('conversations', (c) => c.chatbot_id === chatbotId)
      : await queryAll('conversations');

    const formatted = convs.map((c) => ({
      id: c.id,
      chatbotId: c.chatbot_id,
      chatbotName: c.chatbot_name,
      title: c.title,
      lastMessage: c.last_message,
      messageCount: c.message_count,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations/:id
router.get('/:id', async (req, res) => {
  try {
    const c = await queryOne('conversations', (item) => item.id === req.params.id);
    if (!c) return res.status(404).json({ error: 'Conversation not found' });

    res.json({
      id: c.id,
      chatbotId: c.chatbot_id,
      chatbotName: c.chatbot_name,
      title: c.title,
      lastMessage: c.last_message,
      messageCount: c.message_count,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations/:id/messages
router.get('/:id/messages', async (req, res) => {
  try {
    const msgs = await queryAll('messages', (m) => m.conversation_id === req.params.id);
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

// DELETE /api/conversations/:id
router.delete('/:id', async (req, res) => {
  try {
    await executeDelete('conversations', (c) => c.id === req.params.id);
    await executeDelete('messages', (m) => m.conversation_id === req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
