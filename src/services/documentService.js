/**
 * services/documentService.js
 * Upload, listagem e remoção de documentos via API real.
 */
import api from './api'

export const documentService = {
  /** Lista todos os documentos do usuário autenticado */
  async list({ page = 1, limit = 20 } = {}) {
    const { data } = await api.get('/documents', { params: { page, limit } })
    return data   // { items, total, page, limit }
  },

  /**
   * Faz upload de um arquivo com metadados.
   * O backend espera multipart/form-data com file + campos de texto.
   */
  async upload(file, metadata, onProgress) {
    const form = new FormData()
    form.append('file',      file)
    form.append('empresa',   metadata.empresa)
    form.append('categoria', metadata.categoria)
    if (metadata.data)      form.append('data_documento', metadata.data)
    if (metadata.descricao) form.append('descricao',      metadata.descricao)

    const { data } = await api.post('/documents', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total))
      },
    })
    return data
  },

  /** Remove um documento e seus chunks vetoriais */
  async delete(documentId) {
    await api.delete(`/documents/${documentId}`)
  },
}
