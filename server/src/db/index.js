import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usePg = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));

let pgPool;
let localStore = {
  knowledge_bases: [],
  documents: [],
  chatbots: [],
  chatbot_knowledge_bases: [],
  conversations: [],
  messages: [],
  settings: [],
};

const storeFilePath = path.join(__dirname, '../../data-store.json');

if (usePg) {
  pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  console.log('[DB] Connected to PostgreSQL pool');
} else {
  console.log('[DB] Using local JSON file store (PostgreSQL compatible fallback)');
  loadLocalStore();
}

function loadLocalStore() {
  if (fs.existsSync(storeFilePath)) {
    try {
      localStore = JSON.parse(fs.readFileSync(storeFilePath, 'utf8'));
    } catch {
      saveLocalStore();
    }
  } else {
    seedInitialData();
  }
}

function saveLocalStore() {
  fs.mkdirSync(path.dirname(storeFilePath), { recursive: true });
  fs.writeFileSync(storeFilePath, JSON.stringify(localStore, null, 2), 'utf8');
}

export async function initDb() {
  if (usePg) {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pgPool.query(schemaSql);
  }
}

function seedInitialData() {
  const now = new Date().toISOString();
  localStore = {
    knowledge_bases: [
      {
        id: 'kb-inventory-01',
        dify_dataset_id: 'dify-ds-inv-001',
        name: 'Inventory & Warehouse Management',
        description: 'Stock policies, SKU catalog guidelines, reorder points, return logistics, and warehouse SOPs.',
        document_count: 12,
        completed_count: 12,
        processing_count: 0,
        failed_count: 0,
        storage_size: '18.6 MB',
        storage_size_bytes: 19504800,
        embedding_model: 'BGE-small-en-v1.5',
        retrieval_strategy: 'Hybrid Search',
        chunking_strategy: 'Paragraph',
        status: 'ready',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'kb-001',
        dify_dataset_id: 'dify-ds-001',
        name: 'Customer Support',
        description: 'General customer support documentation including FAQs and policies.',
        document_count: 15,
        completed_count: 13,
        processing_count: 1,
        failed_count: 1,
        storage_size: '12.4 MB',
        storage_size_bytes: 13004800,
        embedding_model: 'BGE-small-en-v1.5',
        retrieval_strategy: 'Hybrid Search',
        chunking_strategy: 'Paragraph',
        status: 'ready',
        created_at: now,
        updated_at: now,
      },
    ],
    documents: [
      {
        id: 'doc-inv-001',
        knowledge_base_id: 'kb-inventory-01',
        dify_document_id: 'dify-doc-inv-001',
        name: 'Warehouse Standard Operating Procedures (SOP).pdf',
        type: 'PDF',
        size: '5.4 MB',
        size_bytes: 5662310,
        status: 'completed',
        chunk_count: 48,
        error_message: null,
        uploaded_at: now,
      },
      {
        id: 'doc-inv-002',
        knowledge_base_id: 'kb-inventory-01',
        dify_document_id: 'dify-doc-inv-002',
        name: 'Stock Replenishment & Reorder Thresholds.docx',
        type: 'DOCX',
        size: '2.1 MB',
        size_bytes: 2202009,
        status: 'completed',
        chunk_count: 22,
        error_message: null,
        uploaded_at: now,
      },
      {
        id: 'doc-inv-003',
        knowledge_base_id: 'kb-inventory-01',
        dify_document_id: 'dify-doc-inv-003',
        name: 'Damaged Goods & Return Handling Policy.md',
        type: 'MD',
        size: '120 KB',
        size_bytes: 122880,
        status: 'completed',
        chunk_count: 14,
        error_message: null,
        uploaded_at: now,
      },
    ],
    chatbots: [
      {
        id: 'cb-inventory-01',
        dify_app_id: 'dify-app-inv-001',
        dify_api_key: '',
        name: 'Inventory Service Bot',
        description: 'Assists warehouse teams and customer service agents with stock levels, SKU lookups, reorder points, and order fulfillment guidelines.',
        status: 'active',
        model: 'GPT-OSS 120B',
        provider: 'Groq',
        temperature: 0.1,
        enable_memory: 1,
        strict_knowledge_mode: 1,
        total_conversations: 520,
        avg_response_time: '0.9s',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'cb-001',
        dify_app_id: 'dify-app-001',
        dify_api_key: '',
        name: 'Customer Support Bot',
        description: 'Handles general customer inquiries, returns, refunds, and shipping questions.',
        status: 'active',
        model: 'GPT-OSS 120B',
        provider: 'Groq',
        temperature: 0.2,
        enable_memory: 1,
        strict_knowledge_mode: 1,
        total_conversations: 842,
        avg_response_time: '1.2s',
        created_at: now,
        updated_at: now,
      },
    ],
    chatbot_knowledge_bases: [
      { chatbot_id: 'cb-inventory-01', knowledge_base_id: 'kb-inventory-01' },
      { chatbot_id: 'cb-001', knowledge_base_id: 'kb-001' },
    ],
    conversations: [
      {
        id: 'conv-inv-001',
        chatbot_id: 'cb-inventory-01',
        chatbot_name: 'Inventory Service Bot',
        dify_conversation_id: 'dify-conv-inv-001',
        title: 'Reorder point for SKU-8849',
        last_message: 'The minimum safety stock threshold is 50 units.',
        message_count: 4,
        created_at: now,
        updated_at: now,
      },
    ],
    messages: [
      {
        id: 'msg-inv-001',
        conversation_id: 'conv-inv-001',
        role: 'user',
        content: 'What is the reorder threshold for SKU-8849?',
        sources: null,
        timestamp: now,
      },
      {
        id: 'msg-inv-002',
        conversation_id: 'conv-inv-001',
        role: 'assistant',
        content: 'Based on the **Stock Replenishment & Reorder Thresholds** document, **SKU-8849** has a minimum safety stock threshold of **50 units**. When inventory drops below this level, an automated reorder purchase order is triggered for 200 units.',
        sources: JSON.stringify([{ document: 'Stock Replenishment & Reorder Thresholds.docx', relevance: 0.96, page: 4 }]),
        timestamp: now,
      },
    ],
    settings: [],
  };
  saveLocalStore();
}

export async function queryAll(tableName, filterFn) {
  if (usePg) {
    const r = await pgPool.query(`SELECT * FROM ${tableName}`);
    return r.rows;
  }
  let items = localStore[tableName] || [];
  if (filterFn) items = items.filter(filterFn);
  return JSON.parse(JSON.stringify(items));
}

export async function queryOne(tableName, filterFn) {
  if (usePg) {
    const r = await pgPool.query(`SELECT * FROM ${tableName}`);
    return r.rows[0];
  }
  const items = localStore[tableName] || [];
  const item = filterFn ? items.find(filterFn) : items[0];
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function executeInsert(tableName, record) {
  if (usePg) {
    const keys = Object.keys(record);
    const values = Object.values(record);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const r = await pgPool.query(sql, values);
    return r.rows[0];
  }
  if (!localStore[tableName]) localStore[tableName] = [];
  localStore[tableName].push(record);
  saveLocalStore();
  return record;
}

export async function executeUpdate(tableName, id, updates) {
  if (usePg) {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    values.push(id);
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    const r = await pgPool.query(sql, values);
    return r.rows[0];
  }
  const items = localStore[tableName] || [];
  const idx = items.findIndex((i) => i.id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    saveLocalStore();
    return items[idx];
  }
  return null;
}

export async function executeDelete(tableName, filterFn) {
  if (usePg) {
    await pgPool.query(`DELETE FROM ${tableName}`);
    return;
  }
  if (localStore[tableName]) {
    localStore[tableName] = localStore[tableName].filter((item) => !filterFn(item));
    saveLocalStore();
  }
}
