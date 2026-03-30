/**
 * pages/ChatPage.jsx
 * Página principal: sidebar + área de chat.
 * Inclui demo de streaming mockado para desenvolvimento sem backend.
 */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import Sidebar    from '../components/Sidebar'
import ChatHeader from '../components/ChatHeader'
import ChatArea   from '../components/ChatArea'
import ChatInput  from '../components/ChatInput'

// ── Mock de streaming (remove quando o backend estiver pronto) ────────────────
const MOCK_RESPONSES = [
  `Com base nos documentos indexados, o **Contrato Social da Empresa XYZ** foi registrado em 15 de março de 2021 na Junta Comercial do Estado de São Paulo.

O capital social é de **R$ 500.000,00**, dividido em 500.000 quotas de R$ 1,00 cada. Os sócios fundadores são João da Silva (60%) e Maria Oliveira (40%).

O objeto social contempla atividades de consultoria empresarial, desenvolvimento de software e prestação de serviços de TI.`,

  `O **Relatório Financeiro do Q3 2024** apresenta os seguintes destaques:

- **Receita líquida**: R$ 2,3M (+18% vs Q3 2023)
- **EBITDA**: R$ 680K (margem de 29,5%)
- **Caixa e equivalentes**: R$ 1,1M

O relatório aponta crescimento consistente nas linhas de serviços recorrentes, com destaque para o segmento de SaaS, que representou 62% da receita total no período.`,

  `Não encontrei documentos com esse critério nos arquivos indexados. Você pode tentar reformular a busca com outros termos ou fazer o upload do documento desejado.`,
]

function mockStream(text, onChunk, onDone) {
  const words = text.split(' ')
  let i = 0
  const interval = setInterval(() => {
    if (i < words.length) {
      onChunk(words[i] + (i < words.length - 1 ? ' ' : ''))
      i++
    } else {
      clearInterval(interval)
      onDone()
    }
  }, 35)
  return () => clearInterval(interval)
}
// ─────────────────────────────────────────────────────────────────────────────

let msgId = 1

export default function ChatPage() {
  const navigate = useNavigate()
  const [messages,    setMessages]    = useState([])
  const [streaming,   setStreaming]   = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatTitle,   setChatTitle]   = useState('')

  const handleSend = useCallback((text) => {
    if (streaming) return

    // Define título da conversa a partir da primeira mensagem
    if (messages.length === 0) setChatTitle(text.slice(0, 60))

    const userMsg = { id: msgId++, role: 'user', content: text, sources: [] }

    const assistantId = msgId++
    const assistantMsg = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
      sources: [true], // indica que terá fontes ao finalizar
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setStreaming(true)

    // Escolhe uma resposta mock aleatória
    const mockText = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]

    mockStream(
      mockText,
      // onChunk
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      },
      // onDone
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, streaming: false, sources: [true] }
              : m
          )
        )
        setStreaming(false)
      }
    )
  }, [streaming, messages])

  const handleClear = useCallback(() => {
    setMessages([])
    setChatTitle('')
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <Sidebar
        onNewChat={handleClear}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* ── Área principal ───────────────────────────────────────────────── */}
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ChatHeader
          title={chatTitle}
          onClear={handleClear}
          onMobileMenuToggle={() => setSidebarOpen((v) => !v)}
        />

        <ChatArea
          messages={messages}
          streaming={streaming}
          onSuggestion={handleSend}
        />

        <ChatInput
          onSend={handleSend}
          streaming={streaming}
          onUploadClick={() => navigate('/upload')}
        />
      </main>
    </div>
  )
}
