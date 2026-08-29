import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, executeInsert, executeUpdate, executeDelete } from '../db/index.js';
import { difyService } from '../services/difyService.js';

const router = express.Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/knowledge-bases/:kbId/documents OR /api/documents
router.get('/', async (req, res) => {
  try {
    const kbId = req.params.kbId;
    const docs = kbId
      ? await queryAll('documents', (item) => item.knowledge_base_id === kbId)
      : await queryAll('documents');

    const formatted = docs.map((d) => ({
      id: d.id,
      knowledgeBaseId: d.knowledge_base_id,
      name: d.name,
      type: d.type,
      size: d.size,
      sizeBytes: d.size_bytes,
      status: d.status,
      chunkCount: d.chunk_count,
      error: d.error_message,
      uploadedAt: d.uploaded_at,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/knowledge-bases/:kbId/documents
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const kbId = req.params.kbId;
    const kb = await queryOne('knowledge_bases', (item) => item.id === kbId);
    if (!kb) return res.status(404).json({ error: 'Knowledge base not found' });

    const files = req.files || [];
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.originalname.split('.').pop().toLowerCase();
      const docId = `doc-${uuidv4().slice(0, 8)}`;
      const now = new Date().toISOString();
      const sizeStr = formatBytes(file.size);

      const difyDoc = await difyService.uploadDocument(
        kb.dify_dataset_id,
        file.buffer,
        file.originalname,
        file.mimetype
      );

      const docRecord = {
        id: docId,
        knowledge_base_id: kbId,
        dify_document_id: difyDoc.id || null,
        name: file.originalname,
        type: ext.toUpperCase(),
        size: sizeStr,
        size_bytes: file.size,
        status: 'completed',
        chunk_count: Math.floor(file.size / 2000) + 5,
        error_message: null,
        uploaded_at: now,
      };

      await executeInsert('documents', docRecord);

      await executeUpdate('knowledge_bases', kbId, {
        document_count: (kb.document_count || 0) + 1,
        completed_count: (kb.completed_count || 0) + 1,
        storage_size_bytes: (kb.storage_size_bytes || 0) + file.size,
        updated_at: now,
      });

      results.push({
        id: docId,
        knowledgeBaseId: kbId,
        name: file.originalname,
        type: ext.toUpperCase(),
        size: sizeStr,
        sizeBytes: file.size,
        status: 'completed',
        chunkCount: Math.floor(file.size / 2000) + 5,
        uploadedAt: now,
      });
    }

    res.status(201).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', async (req, res) => {
  try {
    const doc = await queryOne('documents', (item) => item.id === req.params.id);
    if (doc) {
      await executeDelete('documents', (item) => item.id === req.params.id);
      const kb = await queryOne('knowledge_bases', (item) => item.id === doc.knowledge_base_id);
      if (kb) {
        await executeUpdate('knowledge_bases', kb.id, {
          document_count: Math.max(0, (kb.document_count || 1) - 1),
          completed_count: Math.max(0, (kb.completed_count || 1) - 1),
          storage_size_bytes: Math.max(0, (kb.storage_size_bytes || 0) - doc.size_bytes),
        });
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default router;
