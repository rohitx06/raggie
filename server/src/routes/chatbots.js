import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, executeInsert, executeUpdate, executeDelete } from '../db/index.js';

const router = express.Router();

// GET /api/chatbots
router.get('/', async (req, res) => {
  try {
    const bots = await queryAll('chatbots');
    const allLinks = await queryAll('chatbot_knowledge_bases');

    const results = bots.map((b) => {
      const kbLinks = allLinks.filter((l) => l.chatbot_id === b.id);
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        status: b.status,
        model: b.model,
        provider: b.provider,
        temperature: b.temperature,
        enableMemory: Boolean(b.enable_memory),
        strictKnowledgeMode: Boolean(b.strict_knowledge_mode),
        knowledgeBaseIds: kbLinks.map((l) => l.knowledge_base_id),
        totalConversations: b.total_conversations,
        avgResponseTime: b.avg_response_time,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chatbots/:id
router.get('/:id', async (req, res) => {
  try {
    const b = await queryOne('chatbots', (item) => item.id === req.params.id);
    if (!b) return res.status(404).json({ error: 'Chatbot not found' });

    const allLinks = await queryAll('chatbot_knowledge_bases');
    const kbLinks = allLinks.filter((l) => l.chatbot_id === b.id);

    res.json({
      id: b.id,
      name: b.name,
      description: b.description,
      status: b.status,
      model: b.model,
      provider: b.provider,
      temperature: b.temperature,
      enableMemory: Boolean(b.enable_memory),
      strictKnowledgeMode: Boolean(b.strict_knowledge_mode),
      knowledgeBaseIds: kbLinks.map((l) => l.knowledge_base_id),
      totalConversations: b.total_conversations,
      avgResponseTime: b.avg_response_time,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chatbots
router.post('/', async (req, res) => {
  try {
    const { name, description, model, provider, temperature, enableMemory, strictKnowledgeMode, knowledgeBaseIds } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const id = `cb-${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();

    const record = {
      id,
      dify_app_id: null,
      dify_api_key: '',
      name,
      description: description || '',
      status: 'active',
      model: model || 'GPT-OSS 120B',
      provider: provider || 'Groq',
      temperature: temperature ?? 0.2,
      enable_memory: enableMemory ? 1 : 0,
      strict_knowledge_mode: strictKnowledgeMode ? 1 : 0,
      total_conversations: 0,
      avg_response_time: '1.2s',
      created_at: now,
      updated_at: now,
    };

    await executeInsert('chatbots', record);

    if (Array.isArray(knowledgeBaseIds)) {
      for (const kbId of knowledgeBaseIds) {
        await executeInsert('chatbot_knowledge_bases', { chatbot_id: id, knowledge_base_id: kbId });
      }
    }

    res.status(201).json({
      id,
      name,
      description: record.description,
      status: 'active',
      model: record.model,
      provider: record.provider,
      temperature: record.temperature,
      enableMemory: Boolean(record.enable_memory),
      strictKnowledgeMode: Boolean(record.strict_knowledge_mode),
      knowledgeBaseIds: knowledgeBaseIds || [],
      totalConversations: 0,
      avgResponseTime: '1.2s',
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/chatbots/:id
router.delete('/:id', async (req, res) => {
  try {
    await executeDelete('chatbots', (item) => item.id === req.params.id);
    await executeDelete('chatbot_knowledge_bases', (item) => item.chatbot_id === req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
