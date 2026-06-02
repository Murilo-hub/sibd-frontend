/**
 * components/MessageBubble.jsx
 * Renderiza uma mensagem individual (usuário ou assistente).
 *
 * CORREÇÃO: respostas do assistente agora renderizam Markdown real
 * usando react-markdown — negrito, listas, títulos e parágrafos
 * ficam formatados corretamente em vez de mostrar * e ** como texto.
 */
import { useState } from 'react'
import { clsx } from 'clsx'
import { User, Bot, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function MessageBubble({ message }) {
  const { role, content, streaming, error, sources } = message
  const isUser      = role === 'user'
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const hasSources  = !isUser && !streaming && !error && sources?.length > 0

  return (
    <div className={clsx('flex gap-3 animate-slide-up', isUser ? 'flex-row-reverse' : 'flex-row')}>

      {/* ── Avatar ──────────────────────────────────────────────────────── */}
      <div className={clsx(
        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
        isUser
          ? 'bg-ink-700 border border-ink-600'
          : 'bg-electric-400/15 border border-electric-400/30'
      )}>
        {isUser
          ? <User size={15} className="text-slate-soft" />
          : <Bot  size={15} className="text-accent" />
        }
      </div>

      {/* ── Balão ───────────────────────────────────────────────────────── */}
      <div className={clsx('flex-1 max-w-[80%]', isUser && 'flex flex-col items-end')}>
        <div className={clsx(
          'rounded-xl px-4 py-3 text-sm leading-relaxed',
          isUser  ? 'bg-elevated border border-ink-700/60 text-slate-soft'
          : error ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                  : 'bg-elevated border border-ink-700/60 text-slate-soft'
        )}>

          {/* Mensagem do usuário — texto simples */}
          {isUser && (
            <p className="whitespace-pre-wrap">{content}</p>
          )}

          {/* Resposta do assistente — renderiza Markdown */}
          {!isUser && (
            <>
              {content ? (
                <div className="markdown-body">
                  <ReactMarkdown
                    components={{
                      // Parágrafos com espaçamento correto
                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                      ),
                      // Negrito
                      strong: ({ children }) => (
                        <strong className="font-semibold text-slate-soft">{children}</strong>
                      ),
                      // Itálico
                      em: ({ children }) => (
                        <em className="italic text-slate-soft">{children}</em>
                      ),
                      // Lista não ordenada — bullets *
                      ul: ({ children }) => (
                        <ul className="list-disc list-outside pl-5 mb-3 space-y-1">{children}</ul>
                      ),
                      // Lista ordenada — números 1. 2. 3.
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside pl-5 mb-3 space-y-1">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                      ),
                      // Títulos
                      h1: ({ children }) => (
                        <h1 className="font-display font-bold text-base text-slate-soft mt-4 mb-2 first:mt-0">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="font-display font-semibold text-sm text-slate-soft mt-3 mb-2 first:mt-0">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="font-medium text-sm text-slate-soft mt-2 mb-1 first:mt-0">{children}</h3>
                      ),
                      // Código inline
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="px-1.5 py-0.5 rounded bg-ink-700 font-mono text-xs text-accent">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-ink-700 rounded-lg p-3 font-mono text-xs text-slate-soft overflow-x-auto my-2">
                            {children}
                          </code>
                        ),
                      // Linha horizontal
                      hr: () => <hr className="border-ink-700 my-3" />,
                      // Blockquote
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-electric-400/40 pl-3 text-slate-muted italic my-2">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : null}

              {/* Cursor piscante durante streaming */}
              {streaming && (
                <span className="inline-block w-2 h-4 ml-0.5 bg-accent rounded-sm animate-pulse align-middle" />
              )}
            </>
          )}
        </div>

        {/* ── Fontes ────────────────────────────────────────────────────── */}
        {hasSources && (
          <div className="mt-2 w-full">
            <button
              onClick={() => setSourcesOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-slate-muted hover:text-accent transition-colors font-mono"
            >
              {sourcesOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {sources.length} fonte{sources.length > 1 ? 's' : ''} consultada{sources.length > 1 ? 's' : ''}
            </button>

            {sourcesOpen && (
              <div className="mt-2 space-y-1.5">
                {sources.map((src, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg bg-ink-800/60 border border-ink-700/40"
                  >
                    <FileText size={12} className="text-accent shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-soft truncate">
                        {src.document_name ?? src.metadata?.original_name ?? 'Documento'}
                      </p>
                      {src.excerpt && (
                        <p className="text-[11px] text-slate-muted mt-0.5 line-clamp-2">
                          {src.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
