const API_BASE = '/api/knowledge-bases';

const knowledgeBaseService = {
  async list() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch knowledge bases');
    return await res.json();
  },

  async get(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Knowledge base ${id} not found`);
    return await res.json();
  },

  async create(data) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create knowledge base');
    return await res.json();
  },

  async update(id, data) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update knowledge base');
    return await res.json();
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete knowledge base');
    return await res.json();
  },
};

export default knowledgeBaseService;
