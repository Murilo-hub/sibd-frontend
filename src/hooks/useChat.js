/**
 * hooks/useChat.js
 * Gerencia estado do chat: mensagens, streaming e envio.
 */
import { useState, useCallback, useRef } from 'react'
import { chatService } from '../services/chatService'

export function useChat() {
  const [messages,   setMessages]   = useState([])
  const [streaming,  setStreaming]   = useState(false)
  const [error,      setError]       = useState(null)
  const streamingIdRef = useRef(null)

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || streaming) return

    // Adiciona mensagem do usuário
    const userMsg = { id: Date.now(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])

    // Cria placeholder de resposta do assistente
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
      // onChunk: acumula o texto em tempo real
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      },
      // onDone: finaliza streaming
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        )
        setStreaming(false)
      },
      // onError
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
      }
    )
  }, [streaming])

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, streaming, error, sendMessage, clearMessages }
}
