-- PostgreSQL & SQLite compatible schema definition

CREATE TABLE IF NOT EXISTS knowledge_bases (
  id TEXT PRIMARY KEY,
  dify_dataset_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  document_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  processing_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  storage_size TEXT DEFAULT '0 B',
  storage_size_bytes INTEGER DEFAULT 0,
  embedding_model TEXT DEFAULT 'BGE-small-en-v1.5',
  retrieval_strategy TEXT DEFAULT 'Hybrid Search',
  chunking_strategy TEXT DEFAULT 'Paragraph',
  status TEXT DEFAULT 'ready',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  knowledge_base_id TEXT NOT NULL,
  dify_document_id TEXT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT NOT NULL,
  size_bytes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  chunk_count INTEGER DEFAULT 0,
  error_message TEXT,
  uploaded_at TEXT NOT NULL,
  FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chatbots (
  id TEXT PRIMARY KEY,
  dify_app_id TEXT,
  dify_api_key TEXT,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  model TEXT DEFAULT 'GPT-OSS 120B',
  provider TEXT DEFAULT 'Groq',
  temperature REAL DEFAULT 0.2,
  enable_memory INTEGER DEFAULT 1,
  strict_knowledge_mode INTEGER DEFAULT 1,
  total_conversations INTEGER DEFAULT 0,
  avg_response_time TEXT DEFAULT '1.2s',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chatbot_knowledge_bases (
  chatbot_id TEXT NOT NULL,
  knowledge_base_id TEXT NOT NULL,
  PRIMARY KEY (chatbot_id, knowledge_base_id),
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE,
  FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  chatbot_id TEXT NOT NULL,
  chatbot_name TEXT NOT NULL,
  dify_conversation_id TEXT,
  title TEXT NOT NULL,
  last_message TEXT,
  message_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  sources TEXT, -- JSON string array of source citations
  timestamp TEXT NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
