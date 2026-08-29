import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, executeInsert, executeUpdate, executeDelete } from '../db/index.js';
import { difyService } from '../services/difyService.js';

const router = express.Router();

// GET /api/knowledge-bases
router.get('/', async (req, res) => {
  try {
    const kbs = await queryAll('knowledge_bases');
    const formatted = kbs.map((k) => ({
      id: k.id,
      name: k.name,
      description: k.description,
      documentCount: k.document_count,
      completedCount: k.completed_count,
      processingCount: k.processing_count,
      failedCount: k.failed_count,
      storageSize: k.storage_size,
      storageSizeBytes: k.storage_size_bytes,
      embeddingModel: k.embedding_model,
      retrievalStrategy: k.retrieval_strategy,
      chunkingStrategy: k.chunking_strategy,
      status: k.status,
      createdAt: k.created_at,
      updatedAt: k.updated_at,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/knowledge-bases/:id
router.get('/:id', async (req, res) => {
  try {
    const k = await queryOne('knowledge_bases', (item) => item.id === req.params.id);
    if (!k) return res.status(404).json({ error: 'Knowledge base not found' });

    res.json({
      id: k.id,
      name: k.name,
      description: k.description,
      documentCount: k.document_count,
      completedCount: k.completed_count,
      processingCount: k.processing_count,
      failedCount: k.failed_count,
      storageSize: k.storage_size,
      storageSizeBytes: k.storage_size_bytes,
      embeddingModel: k.embedding_model,
      retrievalStrategy: k.retrieval_strategy,
      chunkingStrategy: k.chunking_strategy,
      status: k.status,
      createdAt: k.created_at,
      updatedAt: k.updated_at,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/knowledge-bases
router.post('/', async (req, res) => {
  try {
    const { name, description, embeddingModel, retrievalStrategy, chunkingStrategy } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const id = `kb-${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();

    const difyDs = await difyService.createDataset(name, description);

    const record = {
      id,
      dify_dataset_id: difyDs.id,
      name,
      description: description || '',
      document_count: 0,
      completed_count: 0,
      processing_count: 0,
      failed_count: 0,
      storage_size: '0 B',
      storage_size_bytes: 0,
      embedding_model: embeddingModel || 'BGE-small-en-v1.5',
      retrieval_strategy: retrievalStrategy || 'Hybrid Search',
      chunking_strategy: chunkingStrategy || 'Paragraph',
      status: 'ready',
      created_at: now,
      updated_at: now,
    };

    await executeInsert('knowledge_bases', record);

    res.status(201).json({
      id,
      name,
      description,
      documentCount: 0,
      completedCount: 0,
      processingCount: 0,
      failedCount: 0,
      storageSize: '0 B',
      embeddingModel: record.embedding_model,
      retrievalStrategy: record.retrieval_strategy,
      chunkingStrategy: record.chunking_strategy,
      status: 'ready',
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/knowledge-bases/:id
router.delete('/:id', async (req, res) => {
  try {
    const k = await queryOne('knowledge_bases', (item) => item.id === req.params.id);
    if (k && k.dify_dataset_id) {
      await difyService.deleteDataset(k.dify_dataset_id);
    }
    await executeDelete('knowledge_bases', (item) => item.id === req.params.id);
    await executeDelete('documents', (item) => item.knowledge_base_id === req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
