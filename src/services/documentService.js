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
   * Faz upload de um arquivo com metadados.
   * @param {File} file
   * @param {{ empresa: string, categoria: string, data_documento?: string, descricao?: string }} metadata
   * @param {Function} onProgress (percent: number) => void
   */
  async upload(file, metadata, onProgress) {
    const form = new FormData()
    form.append('file', file)
    form.append('empresa', metadata.empresa)
    form.append('categoria', metadata.categoria)
    if (metadata.data_documento) form.append('data_documento', metadata.data_documento)
    if (metadata.descricao)      form.append('descricao',      metadata.descricao)

    const { data } = await api.post('/documents', form, {
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