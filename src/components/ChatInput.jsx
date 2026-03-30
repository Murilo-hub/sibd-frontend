/**
 * components/ChatInput.jsx
 * Barra de entrada do chat: textarea auto-resize, botão de envio,
 * atalho de upload e indicador de streaming.
 */
import { useState, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import { Send, Paperclip, Square, Mic } from 'lucide-react'

export default function ChatInput({ onSend, streaming, onUploadClick }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || streaming) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, streaming, onSend])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    // Auto-resize
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
    }
  }

  const canSend = value.trim().length > 0 && !streaming

  return (
    <div className="border-t border-subtle bg-surface/80 backdrop-blur px-4 py-3">
      {/* ── Container do input ─────────────────────────────────────────── */}
      <div
        className={clsx(
          'flex items-end gap-2 rounded-xl border transition-all duration-200',
          'bg-elevated px-3 py-2',
          'border-ink-700 focus-within:border-electric-500/60 focus-within:ring-1 focus-within:ring-electric-500/20'
        )}
      >
        {/* Botão de upload */}
        <button
          onClick={onUploadClick}
          className="p-1.5 rounded-lg text-slate-muted hover:text-slate-soft hover:bg-ink-700 transition-colors shrink-0 mb-0.5"
          title="Enviar documento"
          disabled={streaming}
        >
          <Paperclip size={16} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Faça uma pergunta sobre seus documentos..."
          disabled={streaming}
          rows={1}
          className={clsx(
            'flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed',
            'text-slate-soft placeholder:text-slate-muted font-body',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[24px] max-h-[160px] py-0.5'
          )}
        />

        {/* Botão enviar / parar */}
        <button
          onClick={handleSend}
          disabled={!canSend && !streaming}
          className={clsx(
            'p-1.5 rounded-lg transition-all duration-200 shrink-0 mb-0.5',
            streaming
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : canSend
              ? 'bg-electric-400 text-ink-950 hover:bg-electric-500 shadow-sm'
              : 'bg-ink-700 text-slate-muted cursor-not-allowed'
          )}
          title={streaming ? 'Parar geração' : 'Enviar mensagem'}
        >
          {streaming ? <Square size={15} strokeWidth={2.5} /> : <Send size={15} strokeWidth={2.5} />}
        </button>
      </div>

      {/* ── Dica de atalho ─────────────────────────────────────────────── */}
      <p className="text-center mt-2 text-[11px] font-mono text-slate-muted">
        <kbd className="px-1 py-0.5 rounded bg-ink-700 text-[10px]">Enter</kbd> para enviar
        {' · '}
        <kbd className="px-1 py-0.5 rounded bg-ink-700 text-[10px]">Shift+Enter</kbd> para nova linha
      </p>
    </div>
  )
}
