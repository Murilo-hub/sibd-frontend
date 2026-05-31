/**
 * services/chatService.js
 * Envio de mensagens e streaming de respostas via SSE.
 */
import api from './api'

export const chatService = {
  /** Busca histórico de conversas */
  async getHistory() {
    const { data } = await api.get('/chat/history')
    return data
  },

  /**
   * Envia mensagem e recebe resposta com streaming SSE.
   * onChunk(text)         — chamado a cada token recebido
   * onDone(sessionId)     — chamado ao receber [DONE], com o session_id do header
   * onError(err)          — chamado em caso de falha
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

      // Captura o session_id retornado no header (útil para continuar a sessão)
      const newSessionId = response.headers.get('X-Session-Id')

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Processa todas as linhas SSE completas (terminadas em \n\n)
        const parts = buffer.split('\n\n')
        buffer = parts.pop() // guarda fragmento incompleto para a próxima iteração

        for (const part of parts) {
          const line = part.trim()
          if (!line.startsWith('data:')) continue

          const payload = line.slice('data:'.length).trim()

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

      // Fallback: stream encerrou sem [DONE]
      onDone?.(newSessionId)
    } catch (err) {
      onError?.(err)
    }
  },
}