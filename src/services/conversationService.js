const API_BASE = '/api/conversations';

const conversationService = {
  async list(filters = {}) {
    const query = filters.chatbotId ? `?chatbotId=${filters.chatbotId}` : '';
    const res = await fetch(`${API_BASE}${query}`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return await res.json();
  },

  async get(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Conversation ${id} not found`);
    return await res.json();
  },

  async getMessages(conversationId) {
    const res = await fetch(`${API_BASE}/${conversationId}/messages`);
    if (!res.ok) return [];
    return await res.json();
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete conversation');
    return await res.json();
  },
};

export default conversationService;
