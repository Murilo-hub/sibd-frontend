/**
 * services/chatService.js
 * Envio de mensagens e streaming de respostas via SSE.
 */
import api from './api'

export const chatService = {
  /** Busca histórico de sessões */
  async getHistory() {
    const { data } = await api.get('/chat/history')
    return data
  },

  /** Busca mensagens de uma sessão específica */
  async getSessionMessages(sessionId) {
    const { data } = await api.get(`/chat/${sessionId}`)
    return data
  },

  /**
   * Envia mensagem e recebe resposta com streaming SSE.
   */
  async sendMessage(message, onChunk, onDone, onError, sessionId = null) {
    const token = localStorage.getItem('sibd_token')
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, ...(sessionId ? { session_id: sessionId } : {}) }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const newSessionId = response.headers.get('X-Session-Id')

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split('\n\n')
        buffer = parts.pop()

        for (const part of parts) {
          const line = part.trim()
          if (!line.startsWith('data:')) continue

          // Remove apenas o prefixo 'data:' + um espaço opcional, preservando o resto
          const payload = line.replace(/^data: ?/, '')

          if (payload === '[DONE]') {
            onDone?.(newSessionId)
            return
          }

          if (payload.startsWith('[ERRO')) {
            onError?.(new Error(payload))
            return
          }

          onChunk?.(payload)
        }
      }

      onDone?.(newSessionId)
    } catch (err) {
      onError?.(err)
    }
  },
}
