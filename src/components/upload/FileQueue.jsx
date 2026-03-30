/**
 * components/upload/FileQueue.jsx
 * Fila de arquivos selecionados aguardando/em progresso/concluídos.
 */
import { clsx } from 'clsx'
import { FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { formatFileSize, fileTypeInfo } from '../../utils'

/* status: 'pending' | 'uploading' | 'processing' | 'done' | 'error' */

const STATUS_LABEL = {
  pending:    'Aguardando',
  uploading:  'Enviando',
  processing: 'Indexando',
  done:       'Concluído',
  error:      'Erro',
}

export default function FileQueue({ files, onRemove }) {
  if (!files.length) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-slate-muted uppercase tracking-wider px-1">
        Fila de envio ({files.length})
      </p>

      <div className="space-y-2">
        {files.map((item) => (
          <FileRow key={item.id} item={item} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}

function FileRow({ item, onRemove }) {
  const { file, status, progress, error } = item
  const typeInfo = fileTypeInfo(file.name)
  const isDone   = status === 'done'
  const isError  = status === 'error'
  const isActive = status === 'uploading' || status === 'processing'
  const canRemove = status === 'pending' || isError || isDone

  return (
    <div className={clsx(
      'rounded-lg border px-3 py-2.5 transition-all duration-300',
      isDone   ? 'border-electric-400/30 bg-electric-400/5' :
      isError  ? 'border-red-500/30 bg-red-500/5' :
                 'border-ink-700/60 bg-elevated'
    )}>
      <div className="flex items-center gap-3">
        {/* Ícone do tipo */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-mono font-bold"
          style={{ backgroundColor: typeInfo.color + '1a', color: typeInfo.color }}
        >
          {typeInfo.label}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-soft truncate font-medium">{file.name}</p>
            <span className={clsx(
              'text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded',
              isDone   ? 'text-electric-400 bg-electric-400/10' :
              isError  ? 'text-red-400 bg-red-400/10' :
              isActive ? 'text-yellow-400 bg-yellow-400/10' :
                         'text-slate-muted bg-ink-700'
            )}>
              {STATUS_LABEL[status]}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-mono text-slate-muted">
              {formatFileSize(file.size)}
            </span>
            {isError && error && (
              <span className="text-[11px] text-red-400 font-mono">· {error}</span>
            )}
          </div>

          {/* Barra de progresso */}
          {(isActive || isDone) && (
            <div className="mt-1.5 h-1 rounded-full bg-ink-700 overflow-hidden">
              <div
                className={clsx(
                  'h-full rounded-full transition-all duration-500',
                  isDone ? 'bg-electric-400' : 'bg-yellow-400'
                )}
                style={{ width: `${isDone ? 100 : progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Ação / status icon */}
        <div className="shrink-0">
          {isDone   && <CheckCircle2 size={16} className="text-electric-400" />}
          {isError  && <AlertCircle  size={16} className="text-red-400" />}
          {isActive && <Loader2 size={16} className="text-yellow-400 animate-spin" />}
          {canRemove && !isActive && (
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 rounded text-slate-muted hover:text-red-400 transition-colors"
              title="Remover da fila"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
