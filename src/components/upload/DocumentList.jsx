/**
 * components/upload/DocumentList.jsx
 * Lista de documentos já indexados no sistema, com busca e ações.
 */
import { useState, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { Search, FileText, Trash2, MessageSquare, Calendar, Building2, Tag, Loader2 } from 'lucide-react'
import { formatDate, fileTypeInfo, truncate } from '../../utils'
import { documentService } from '../../services/documentService'

export default function DocumentList({ refreshTrigger = 0 }) {
  const [docs,    setDocs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [confirm, setConfirm] = useState(null) // id para confirmar exclusão

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await documentService.list()
      // API retorna { documents: [...], total: N } ou array direto
      setDocs(Array.isArray(data) ? data : (data.documents ?? []))
    } catch (err) {
      setError('Não foi possível carregar os documentos.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Carrega na montagem e toda vez que um upload novo é concluído
  useEffect(() => { fetchDocs() }, [fetchDocs, refreshTrigger])

  const handleDelete = async (id) => {
    try {
      await documentService.delete(id)
      setDocs((prev) => prev.filter((d) => d.id !== id))
    } catch {
      // mantém o item na lista se falhar
    }
    setConfirm(null)
  }

  const filtered = docs.filter((d) => {
    const q = search.toLowerCase()
    return (
      (d.filename ?? d.name ?? '').toLowerCase().includes(q) ||
      (d.empresa ?? '').toLowerCase().includes(q) ||
      (d.categoria ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-sm text-slate-soft">
            Documentos indexados
          </h2>
          <p className="text-xs text-slate-muted font-mono mt-0.5">
            {loading ? '...' : `${docs.length} documento${docs.length !== 1 ? 's' : ''} no sistema`}
          </p>
        </div>

        {/* Busca */}
        <div className="relative w-52">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
          <input
            type="text"
            placeholder="Filtrar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-8 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Estados */}
      {loading && (
        <div className="flex items-center justify-center py-10 gap-2 text-slate-muted text-sm">
          <Loader2 size={16} className="animate-spin" />
          Carregando documentos...
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-10 text-red-400 text-sm">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-10 text-slate-muted text-sm">
          {docs.length === 0 ? 'Nenhum documento indexado ainda.' : 'Nenhum documento encontrado.'}
        </div>
      )}

      {/* Lista */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <DocRow
              key={doc.id}
              doc={doc}
              confirming={confirm === doc.id}
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

function DocRow({ doc, confirming, onConfirmDelete, onCancelDelete, onDelete }) {
  const name     = doc.filename ?? doc.name ?? 'Sem nome'
  const typeInfo = fileTypeInfo(name)
  const chunks   = doc.chunk_count ?? doc.chunks ?? '—'
  const size     = doc.file_size_kb ? `${doc.file_size_kb} KB` : (doc.tamanho ?? '—')
  const indexado = doc.created_at ?? doc.indexado

  return (
    <div className={clsx(
      'rounded-xl border px-4 py-3 transition-all duration-200',
      confirming
        ? 'border-red-500/40 bg-red-500/5'
        : 'border-ink-700/60 bg-elevated hover:border-ink-600/60'
    )}>
      <div className="flex items-center gap-3">
        {/* Tipo badge */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-mono font-bold"
          style={{ backgroundColor: typeInfo.color + '1a', color: typeInfo.color }}
        >
          {typeInfo.label}
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-soft font-medium truncate">{name}</p>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {doc.empresa && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
                <Building2 size={10} /> {doc.empresa}
              </span>
            )}
            {doc.categoria && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
                <Tag size={10} /> {doc.categoria}
              </span>
            )}
            {indexado && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
                <Calendar size={10} /> {formatDate(indexado)}
              </span>
            )}
          </div>
        </div>

        {/* Chunks badge */}
        <div className="hidden sm:flex flex-col items-end shrink-0 gap-1">
          <span className="badge text-[10px]">{chunks} chunks</span>
          <span className="text-[11px] font-mono text-slate-muted">{size}</span>
        </div>

        {/* Ações */}
        {!confirming ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              className="p-1.5 rounded-lg text-slate-muted hover:text-accent hover:bg-electric-400/10 transition-colors"
              title="Perguntar sobre este documento"
            >
              <MessageSquare size={14} />
            </button>
            <button
              onClick={onConfirmDelete}
              className="p-1.5 rounded-lg text-slate-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Excluir documento"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0 animate-fade-in">
            <span className="text-xs text-red-400 font-mono">Excluir?</span>
            <button
              onClick={onDelete}
              className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-mono"
            >
              Sim
            </button>
            <button
              onClick={onCancelDelete}
              className="px-2 py-1 rounded text-xs bg-ink-700 text-slate-muted hover:bg-ink-600 transition-colors font-mono"
            >
              Não
            </button>
          </div>
        )}
      </div>
    </div>
  )
}