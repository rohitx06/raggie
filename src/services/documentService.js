const SUPPORTED_FORMATS = ['pdf', 'docx', 'txt', 'md', 'csv', 'html'];

const documentService = {
  supportedFormats: SUPPORTED_FORMATS,

  async list(knowledgeBaseId) {
    const url = knowledgeBaseId
      ? `/api/knowledge-bases/${knowledgeBaseId}/documents`
      : '/api/documents';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return await res.json();
  },

  async upload(knowledgeBaseId, files, onProgress) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    // Simulate progress ticks
    onProgress?.(0, 30);
    onProgress?.(0, 60);

    const res = await fetch(`/api/knowledge-bases/${knowledgeBaseId}/documents`, {
      method: 'POST',
      body: formData,
    });

    onProgress?.(0, 100);

    if (!res.ok) throw new Error('Failed to upload documents');
    return await res.json();
  },

  async delete(id) {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete document');
    return await res.json();
  },
};

export default documentService;
