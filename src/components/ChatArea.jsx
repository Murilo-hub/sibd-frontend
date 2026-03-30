/**
 * components/ChatArea.jsx
 * Área de mensagens: scroll automático, estado vazio e lista de bubbles.
 */
import { useEffect, useRef } from 'react'
import { FileSearch, Zap, Shield, Database } from 'lucide-react'
import MessageBubble from './MessageBubble'

// ── Sugestões para estado vazio ───────────────────────────────────────────────
const SUGGESTIONS = [
  {
    icon: <FileSearch size={16} className="text-accent" />,
    text: 'Encontre o contrato social da empresa XYZ',
  },
  {
    icon: <Zap size={16} className="text-accent" />,
    text: 'Resuma o relatório financeiro do Q3 2024',
  },
  {
    icon: <Shield size={16} className="text-accent" />,
    text: 'Quais são as cláusulas de confidencialidade do NDA?',
  },
  {
    icon: <Database size={16} className="text-accent" />,
    text: 'Liste todos os documentos cadastrados em janeiro',
  },
]

export default function ChatArea({ messages, streaming, onSuggestion }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  // Scroll automático para o fim ao receber mensagens
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, streaming])

  const isEmpty = messages.length === 0

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
    >
      {isEmpty ? (
        <EmptyState onSuggestion={onSuggestion} />
      ) : (
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}

function EmptyState({ onSuggestion }) {
  return (
    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto gap-8 animate-fade-in">
      {/* Ícone central */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-electric-400/10 border border-electric-400/20 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M6 8h7M6 12h12M6 16h9" stroke="#4df0c0" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="18" cy="16" r="3" fill="none" stroke="#4df0c0" strokeWidth="1.5" />
            <path d="M20.2 18.2l1.5 1.5" stroke="#4df0c0" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="font-display font-bold text-xl text-slate-soft">
            Como posso ajudar?
          </h2>
          <p className="text-slate-muted text-sm mt-1">
            Faça perguntas sobre seus documentos corporativos
          </p>
        </div>
      </div>

      {/* Cards de sugestão */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion?.(s.text)}
            className="flex items-start gap-3 text-left rounded-xl px-4 py-3.5
                       bg-elevated border border-ink-700/60 text-slate-soft text-sm
                       hover:border-electric-500/40 hover:bg-ink-800/80
                       active:scale-[0.99] transition-all duration-150"
          >
            <span className="mt-0.5 shrink-0">{s.icon}</span>
            <span className="leading-snug">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
