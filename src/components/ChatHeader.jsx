/**
 * components/ChatHeader.jsx
 * Barra superior do chat: título da conversa ativa e ações.
 */
import { clsx } from 'clsx'
import { Trash2, Download, MoreHorizontal, Menu } from 'lucide-react'

export default function ChatHeader({ title, onClear, onMobileMenuToggle }) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-subtle bg-surface/90 backdrop-blur min-h-[64px] shrink-0">
      {/* Menu mobile */}
      <button
        onClick={onMobileMenuToggle}
        className="p-1.5 rounded-lg text-slate-muted hover:text-slate-soft hover:bg-elevated transition-colors md:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Título */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-semibold text-sm text-slate-soft truncate">
          {title || 'Nova consulta'}
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse-slow" />
          <span className="text-[11px] font-mono text-slate-muted">
            RAG ativo · pgvector
          </span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-1">
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg text-slate-muted hover:text-slate-soft hover:bg-elevated transition-colors"
          title="Limpar conversa"
        >
          <Trash2 size={15} />
        </button>
        <button
          className="p-1.5 rounded-lg text-slate-muted hover:text-slate-soft hover:bg-elevated transition-colors"
          title="Exportar conversa"
        >
          <Download size={15} />
        </button>
        <button
          className="p-1.5 rounded-lg text-slate-muted hover:text-slate-soft hover:bg-elevated transition-colors"
          title="Mais opções"
        >
          <MoreHorizontal size={15} />
        </button>
      </div>
    </header>
  )
}
