/**
 * components/upload/DropZone.jsx
 * Área de drag-and-drop para seleção de arquivos.
 */
import { useState, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import { UploadCloud, FileText, AlertCircle } from 'lucide-react'

const ACCEPTED = {
  'application/pdf':                          ['.pdf'],
  'application/msword':                       ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain':                               ['.txt'],
}
const ACCEPTED_EXTS   = ['.pdf', '.doc', '.docx', '.txt']
const MAX_SIZE_MB      = 50
const MAX_SIZE_BYTES   = MAX_SIZE_MB * 1024 * 1024

function validateFile(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!ACCEPTED_EXTS.includes(ext))
    return `Formato não suportado. Use: ${ACCEPTED_EXTS.join(', ')}`
  if (file.size > MAX_SIZE_BYTES)
    return `Arquivo muito grande. Máximo: ${MAX_SIZE_MB}MB`
  return null
}

export default function DropZone({ onFilesSelected }) {
  const [dragging, setDragging] = useState(false)
  const [dragError, setDragError] = useState('')
  const inputRef = useRef(null)

  const processFiles = useCallback((fileList) => {
    const files   = Array.from(fileList)
    const valid   = []
    const errors  = []

    files.forEach((f) => {
      const err = validateFile(f)
      if (err) errors.push(`${f.name}: ${err}`)
      else valid.push(f)
    })

    if (errors.length) setDragError(errors.join(' • '))
    else setDragError('')

    if (valid.length) onFilesSelected(valid)
  }, [onFilesSelected])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  return (
    <div className="space-y-2">
      {/* ── Área de drop ───────────────────────────────────────────────── */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'relative flex flex-col items-center justify-center gap-3 rounded-xl',
          'border-2 border-dashed cursor-pointer transition-all duration-200 py-12 px-6',
          dragging
            ? 'border-electric-400 bg-electric-400/5 scale-[1.01]'
            : 'border-ink-700 hover:border-ink-600 hover:bg-elevated/60 bg-elevated/30'
        )}
      >
        {/* Ícone animado */}
        <div className={clsx(
          'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200',
          dragging
            ? 'bg-electric-400/20 border border-electric-400/40'
            : 'bg-ink-800 border border-ink-700'
        )}>
          <UploadCloud
            size={24}
            className={clsx(
              'transition-all duration-200',
              dragging ? 'text-accent scale-110' : 'text-slate-muted'
            )}
          />
        </div>

        <div className="text-center">
          <p className="font-display font-semibold text-sm text-slate-soft">
            {dragging ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
          </p>
          <p className="text-xs text-slate-muted mt-1 font-mono">
            PDF, DOC, DOCX, TXT · máx. {MAX_SIZE_MB}MB por arquivo
          </p>
        </div>

        {/* Tipos de arquivo suportados */}
        <div className="flex items-center gap-2 mt-1">
          {ACCEPTED_EXTS.map((ext) => (
            <span key={ext} className="badge text-[10px]">
              <FileText size={9} />
              {ext.replace('.', '').toUpperCase()}
            </span>
          ))}
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTS.join(',')}
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />
      </div>

      {/* Erro de validação */}
      {dragError && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg
                        bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-fade-in">
          <AlertCircle size={12} className="shrink-0 mt-0.5" />
          <span className="font-mono">{dragError}</span>
        </div>
      )}
    </div>
  )
}
