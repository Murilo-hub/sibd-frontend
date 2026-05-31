/**
 * hooks/useChat.js
 * Gerencia estado do chat: mensagens, streaming, sessão e envio.
 */
import { useState, useCallback, useRef } from 'react'
import { chatService } from '../services/chatService'

export function useChat() {
  const [messages,   setMessages]   = useState([])
  const [streaming,  setStreaming]  = useState(false)
  const [error,      setError]      = useState(null)
  const [sessionId,  setSessionId]  = useState(null)
  const streamingIdRef = useRef(null)

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || streaming) return

    const userMsg = { id: Date.now(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])

    const assistantId = Date.now() + 1
    streamingIdRef.current = assistantId
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', streaming: true, sources: [] },
    ])
    setStreaming(true)
    setError(null)

    await chatService.sendMessage(
      text,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      },
      (newSessionId) => {
        if (newSessionId) setSessionId(newSessionId)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        )
        setStreaming(false)
      },
      (err) => {
        setError('Erro ao obter resposta. Tente novamente.')
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'Erro ao gerar resposta.', streaming: false, error: true }
              : m
          )
        )
        setStreaming(false)
        console.error(err)
      },
      sessionId,
    )
  }, [streaming, sessionId])

  const loadSession = useCallback(async (id) => {
    try {
      const data = await chatService.getSessionMessages(id)
      const loaded = (data.messages ?? []).map((m) => ({
        id:       m.id,
        role:     m.role,
        content:  m.content,
        sources:  m.sources?.chunks ?? [],
        streaming: false,
      }))
      setMessages(loaded)
      setSessionId(String(id))
    } catch (err) {
      console.error('Erro ao carregar sessão', err)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(null)
  }, [])

  return { messages, streaming, error, sessionId, sendMessage, loadSession, clearMessages }
}
