const API_BASE = '/api/chatbots';

const chatbotService = {
  async list() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch chatbots');
    return await res.json();
  },

  async get(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Chatbot ${id} not found`);
    return await res.json();
  },

  async create(data) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create chatbot');
    return await res.json();
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete chatbot');
    return await res.json();
  },

  async getMessages(chatbotId) {
    const res = await fetch(`${API_BASE}/${chatbotId}/messages`);
    if (!res.ok) return [];
    return await res.json();
  },

  async sendMessage(chatbotId, message) {
    const res = await fetch(`${API_BASE}/${chatbotId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return await res.json();
  },
};

export default chatbotService;
