/**
 * components/upload/DocumentList.jsx
 * Lista de documentos já indexados no sistema, com busca e ações.
 */
import { useState } from 'react'
import { clsx } from 'clsx'
import { Search, FileText, Trash2, MessageSquare, Calendar, Building2, Tag } from 'lucide-react'
import { formatDate, fileTypeInfo, truncate } from '../../utils'

// ── Mock de documentos indexados ─────────────────────────────────────────────
const MOCK_DOCS = [
  { id: 1, name: 'Contrato Social XYZ.pdf',           empresa: 'XYZ Ltda',      categoria: 'Societário',   tipo: 'PDF',  tamanho: '340 KB', indexado: '2025-01-15T10:00:00Z', chunks: 42 },
  { id: 2, name: 'Relatório Financeiro Q3 2024.pdf',  empresa: 'XYZ Ltda',      categoria: 'Financeiro',   tipo: 'PDF',  tamanho: '1.2 MB', indexado: '2025-01-14T14:22:00Z', chunks: 118 },
  { id: 3, name: 'Política de Privacidade v2.docx',   empresa: 'Alpha Corp',    categoria: 'Compliance',   tipo: 'DOCX', tamanho: '128 KB', indexado: '2025-01-13T09:10:00Z', chunks: 31 },
  { id: 4, name: 'Ata Reunião Board Outubro.docx',    empresa: 'XYZ Ltda',      categoria: 'Governança',   tipo: 'DOCX', tamanho: '95 KB',  indexado: '2025-01-12T16:45:00Z', chunks: 24 },
  { id: 5, name: 'NDA Fornecedor Alpha Ltda.pdf',     empresa: 'Alpha Ltda',    categoria: 'Contratos',    tipo: 'PDF',  tamanho: '210 KB', indexado: '2025-01-10T11:30:00Z', chunks: 19 },
  { id: 6, name: 'Manual de Compliance Interno.pdf',  empresa: 'XYZ Ltda',      categoria: 'Compliance',   tipo: 'PDF',  tamanho: '2.1 MB', indexado: '2025-01-08T08:00:00Z', chunks: 204 },
]

export default function DocumentList() {
  const [search, setSearch]   = useState('')
  const [confirm, setConfirm] = useState(null) // id para confirmar exclusão

  const filtered = MOCK_DOCS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.empresa.toLowerCase().includes(search.toLowerCase()) ||
    d.categoria.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-sm text-slate-soft">
            Documentos indexados
          </h2>
          <p className="text-xs text-slate-muted font-mono mt-0.5">
            {MOCK_DOCS.length} documento{MOCK_DOCS.length !== 1 ? 's' : ''} no sistema
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

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-muted text-sm">
          Nenhum documento encontrado.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <DocRow
              key={doc.id}
              doc={doc}
              confirming={confirm === doc.id}
              onConfirmDelete={() => setConfirm(doc.id)}
              onCancelDelete={() => setConfirm(null)}
              onDelete={() => { setConfirm(null); /* TODO: chamar API */ }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DocRow({ doc, confirming, onConfirmDelete, onCancelDelete, onDelete }) {
  const typeInfo = fileTypeInfo(doc.name)

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
          <p className="text-sm text-slate-soft font-medium truncate">{doc.name}</p>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
              <Building2 size={10} /> {doc.empresa}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
              <Tag size={10} /> {doc.categoria}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-muted">
              <Calendar size={10} /> {formatDate(doc.indexado)}
            </span>
          </div>
        </div>

        {/* Chunks badge */}
        <div className="hidden sm:flex flex-col items-end shrink-0 gap-1">
          <span className="badge text-[10px]">
            {doc.chunks} chunks
          </span>
          <span className="text-[11px] font-mono text-slate-muted">{doc.tamanho}</span>
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
