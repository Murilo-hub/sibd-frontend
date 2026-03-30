/**
 * services/documentService.js
 * Upload e listagem de documentos.
 */
import api from './api'

export const documentService = {
  /** Lista todos os documentos do usuário */
  async list() {
    const { data } = await api.get('/documents')
    return data
  },

  /**
   * Faz upload de um arquivo.
   * @param {File} file
   * @param {Function} onProgress (percent: number) => void
   */
  async upload(file, onProgress) {
    const form = new FormData()
    form.append('file', file)

    const { data } = await api.post('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total))
      },
    })
    return data
  },

  /** Remove um documento */
  async delete(documentId) {
    await api.delete(`/documents/${documentId}`)
  },
}
