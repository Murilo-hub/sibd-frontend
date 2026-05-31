/**
 * pages/ChatPage.jsx
 * Página principal: sidebar + área de chat.
 */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar    from '../components/Sidebar'
import ChatHeader from '../components/ChatHeader'
import ChatArea   from '../components/ChatArea'
import ChatInput  from '../components/ChatInput'
import { useChat } from '../hooks/useChat'

export default function ChatPage() {
  const navigate = useNavigate()
  const { messages, streaming, sessionId, sendMessage, loadSession, clearMessages } = useChat()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatTitle,   setChatTitle]   = useState('')

  const handleSend = useCallback((text) => {
    if (streaming) return
    if (messages.length === 0) setChatTitle(text.slice(0, 60))
    sendMessage(text)
  }, [streaming, messages, sendMessage])

  const handleClear = useCallback(() => {
    clearMessages()
    setChatTitle('')
  }, [clearMessages])

  const handleSelectSession = useCallback((session) => {
    loadSession(session.id)
    setChatTitle(session.title)
  }, [loadSession])

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar
        onNewChat={handleClear}
        onSelectSession={handleSelectSession}
        activeSessionId={sessionId}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

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
