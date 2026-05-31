/**
 * components/MessageBubble.jsx
 * Renderiza uma mensagem individual (usuário ou assistente).
 * Suporta modo streaming com cursor piscante e exibição de fontes reais.
 */
import { clsx } from 'clsx'
import { FileText, User, Bot, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function MessageBubble({ message }) {
  const { role, content, streaming, error, sources } = message
  const isUser = role === 'user'
  const [sourcesOpen, setSourcesOpen] = useState(false)

  const realSources = !isUser && !streaming && !error && Array.isArray(sources) && sources.length > 0
    ? sources
    : []

  return (
    <div
      className={clsx(
        'flex gap-3 animate-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* ── Avatar ─────────────────────────────────────────────────────── */}
      <div
        className={clsx(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
          isUser
            ? 'bg-ink-700 border border-ink-600'
            : 'bg-electric-400/15 border border-electric-400/30'
        )}
      >
        {isUser
          ? <User size={15} className="text-slate-soft" />
          : <Bot  size={15} className="text-accent" />
        }
      </div>

      {/* ── Conteúdo ───────────────────────────────────────────────────── */}
      <div className={clsx('flex-1 max-w-[80%]', isUser && 'flex flex-col items-end')}>
        {/* Balão */}
        <div
          className={clsx(
            'rounded-xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'bg-elevated border border-ink-700/60 text-slate-soft'
              : error
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-ink-900/50 border border-ink-800/50 text-slate-soft'
          )}
        >
          {error && (
            <span className="flex items-center gap-1.5 mb-1 text-red-400 text-xs font-mono">
              <AlertCircle size={12} /> Erro
            </span>
          )}

          <span className="font-body whitespace-pre-wrap">
            {content || (streaming && '')}
          </span>
          {streaming && <span className="streaming-cursor" />}
        </div>

        {/* ── Fontes reais ─────────────────────────────────────────────── */}
        {realSources.length > 0 && (
          <div className="mt-2 w-full max-w-full">
            <button
              onClick={() => setSourcesOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-slate-muted hover:text-slate-soft transition-colors font-mono"
            >
              <FileText size={11} />
              {realSources.length} fonte{realSources.length > 1 ? 's' : ''} consultada{realSources.length > 1 ? 's' : ''}
              {sourcesOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>

            {sourcesOpen && (
              <div className="mt-1.5 space-y-1.5 animate-fade-in">
                {realSources.map((src, i) => (
                  <SourceCard key={i} source={src} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SourceCard({ source }) {
  const fileName = source.metadata?.original_name ?? source.document_id ?? 'Documento'
  const excerpt  = source.excerpt ?? source.content?.slice(0, 200) ?? ''
  const similarity = source.similarity ? `${Math.round(source.similarity * 100)}%` : null

  return (
    <div className="rounded-lg border border-ink-700/60 bg-ink-900/40 px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <FileText size={11} className="text-accent shrink-0" />
        <span className="text-xs font-mono text-accent truncate">{fileName}</span>
        {similarity && (
          <span className="ml-auto text-[11px] font-mono text-slate-muted shrink-0">
            {similarity}
          </span>
        )}
      </div>
      {excerpt && (
        <p className="text-xs text-slate-muted leading-snug line-clamp-2 italic">
          "{excerpt}"
        </p>
      )}
    </div>
  )
}
