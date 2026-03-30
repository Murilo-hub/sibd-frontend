/**
 * services/chatService.js
 * Envio de mensagens e streaming de respostas via SSE / fetch streaming.
 */
import api from './api'

export const chatService = {
  /** Busca histórico de conversas */
  async getHistory() {
    const { data } = await api.get('/chat/history')
    return data
  },

  /**
   * Envia mensagem e recebe resposta com streaming.
   * onChunk(text) é chamado a cada novo trecho recebido.
   * onDone(fullResponse) é chamado ao finalizar.
   */
  async sendMessage(message, onChunk, onDone, onError) {
    const token = localStorage.getItem('sibd_token')
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        full += chunk
        onChunk?.(chunk)
      }

      onDone?.(full)
    } catch (err) {
      onError?.(err)
    }
  },
}
