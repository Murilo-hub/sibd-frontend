/**
 * components/upload/DocumentList.jsx
 * Lista documentos reais do banco via API — sem mock.
 *
 * Props:
 *   documents  → array de DocumentResponse vindo da API
 *   loading    → boolean — exibe skeleton enquanto carrega
 *   onDelete   → (id) => void — chamado após confirmação de exclusão
 *   onRefresh  → () => void — recarrega a lista
 */
import { useState } from 'react'
import { clsx } from 'clsx'
import {
  Search, FileText, Trash2, MessageSquare,
  Calendar, Building2, Tag, Loader2, RefreshCw,
} from 'lucide-react'
import { formatDate, fileTypeInfo, truncate } from '../../utils'

export default function DocumentList({ documents = [], loading = false, onDelete, onRefresh }) {
  const [search,  setSearch]  = useState('')
  const [confirm, setConfirm] = useState(null)   // id aguardando confirmação de delete
  const [deleting, setDeleting] = useState(null) // id sendo deletado agora

  // Filtra localmente por nome, empresa ou categoria
  const filtered = documents.filter((d) => {
    const q = search.toLowerCase()
    return (
      (d.original_name  ?? '').toLowerCase().includes(q) ||
      (d.empresa        ?? '').toLowerCase().includes(q) ||
      (d.categoria      ?? '').toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await onDelete(id)   // UploadPage chama documentService.delete()
    } finally {
      setDeleting(null)
      setConfirm(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-sm text-slate-soft">
            Documentos indexados
          </h2>
          <p className="text-xs text-slate-muted font-mono mt-0.5">
            {loading
              ? 'Carregando...'
              : `${documents.length} documento${documents.length !== 1 ? 's' : ''} no sistema`
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de recarregar */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-muted hover:text-accent hover:bg-electric-400/10 transition-colors"
            title="Atualizar lista"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Busca */}
          <div className="relative w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
            <input
              type="text"
              placeholder="Filtrar documentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-8 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* ── Skeleton de loading ────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-elevated px-4 py-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-ink-700/60" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-ink-700/60 rounded w-2/3" />
                  <div className="h-2 bg-ink-700/40 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Lista vazia ────────────────────────────────────────────────── */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-10 text-slate-muted text-sm">
          {search
            ? 'Nenhum documento encontrado para esta busca.'
            : 'Nenhum documento indexado ainda.'}
        </div>
      )}

      {/* ── Documentos ─────────────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <DocRow
              key={doc.id}
              doc={doc}
              confirming={confirm === doc.id}
              deleting={deleting === doc.id}
              onConfirmDelete={() => setConfirm(doc.id)}
              onCancelDelete={() => setConfirm(null)}
              onDelete={() => handleDelete(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DocRow({ doc, confirming, deleting, onConfirmDelete, onCancelDelete, onDelete }) {
  const typeInfo = fileTypeInfo(doc.original_name ?? doc.filename)

  // Badge de status da indexação
  const statusBadge = {
    pending:    { label: 'Aguardando', color: 'text-yellow-400' },
    processing: { label: 'Indexando…', color: 'text-blue-400'   },
    indexed:    { label: 'Indexado',   color: 'text-green-400'  },
    error:      { label: 'Erro',       color: 'text-red-400'    },
  }[doc.status] ?? { label: doc.status, color: 'text-slate-muted' }

  return (
    <div className={clsx(
      'rounded-xl border px-4 py-3 transition-all duration-200',
      confirming
        ? 'border-red-500/40 bg-red-500/5'
        : 'border-ink-700/60 bg-elevated hover:border-ink-600/60'
    )}>
      <div className="flex items-center gap-3">
        {/* Ícone do tipo */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-mono font-bold"
          style={{ backgroundColor: typeInfo.color + '1a', color: typeInfo.color }}
        >
          {typeInfo.label}
        </div>

        {/* Informações */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-soft font-medium truncate">
            {doc.original_name ?? doc.filename}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
              <Building2 size={10} /> {doc.empresa}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
              <Tag size={10} /> {doc.categoria}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
              <Calendar size={10} /> {formatDate(doc.created_at)}
            </span>
            <span className={clsx('text-[11px] font-mono', statusBadge.color)}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        {/* Chunks + tamanho */}
        <div className="hidden sm:flex flex-col items-end shrink-0 gap-1">
          {doc.chunks_count > 0 && (
            <span className="badge text-[10px]">{doc.chunks_count} chunks</span>
          )}
          <span className="text-[11px] font-mono text-slate-muted">
            {doc.file_size_readable ?? '—'}
          </span>
        </div>

        {/* Ações */}
        {!confirming ? (
          <button
            onClick={onConfirmDelete}
            className="p-1.5 rounded-lg text-slate-muted hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onDelete}
              disabled={deleting}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors flex items-center gap-1"
            >
              {deleting ? <Loader2 size={11} className="animate-spin" /> : null}
              Confirmar
            </button>
            <button
              onClick={onCancelDelete}
              className="px-2.5 py-1 rounded-lg bg-ink-700/60 text-slate-muted text-xs hover:bg-ink-600/60 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
