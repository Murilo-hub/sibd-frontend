/**
 * pages/UploadPage.jsx
 * Página de upload de documentos:
 * - Dropzone de arquivos
 * - Formulário de metadados
 * - Fila de envio com progresso
 * - Lista de documentos já indexados
 *
 * Mock de upload: simula progresso e indexação sem backend.
 */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react'
import Sidebar      from '../components/Sidebar'
import DropZone     from '../components/upload/DropZone'
import MetadataForm from '../components/upload/MetadataForm'
import FileQueue    from '../components/upload/FileQueue'
import DocumentList from '../components/upload/DocumentList'
import { uid }      from '../utils'

// ── Simulação de upload (remove quando backend estiver pronto) ────────────────
function mockUpload(onProgress, onProcessing, onDone) {
  let p = 0
  const uploadInterval = setInterval(() => {
    p += Math.random() * 18 + 5
    if (p >= 100) {
      p = 100
      clearInterval(uploadInterval)
      onProgress(100)
      onProcessing()
      // Simula indexação (chunking + embeddings)
      setTimeout(onDone, 1800)
    } else {
      onProgress(Math.round(p))
    }
  }, 120)
}
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_META = { empresa: '', categoria: '', data: '', descricao: '' }

export default function UploadPage() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [queue,       setQueue]       = useState([])
  const [metadata,    setMetadata]    = useState(EMPTY_META)
  const [metaErrors,  setMetaErrors]  = useState({})
  const [uploading,   setUploading]   = useState(false)
  const [successCount, setSuccessCount] = useState(0)

  // Adiciona arquivos à fila
  const handleFilesSelected = useCallback((files) => {
    const newItems = files.map((file) => ({
      id:       uid(),
      file,
      status:   'pending',
      progress: 0,
      error:    null,
    }))
    setQueue((prev) => [...prev, ...newItems])
  }, [])

  // Remove da fila
  const handleRemove = useCallback((id) => {
    setQueue((prev) => prev.filter((f) => f.id !== id))
  }, [])

  // Valida metadados
  const validateMeta = () => {
    const errs = {}
    if (!metadata.empresa.trim())   errs.empresa   = 'Campo obrigatório'
    if (!metadata.categoria)        errs.categoria = 'Selecione uma categoria'
    setMetaErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Dispara o upload de todos os arquivos pendentes
  const handleUploadAll = useCallback(() => {
    if (!validateMeta()) return
    const pending = queue.filter((f) => f.status === 'pending')
    if (!pending.length) return

    setUploading(true)

    pending.forEach((item) => {
      // Muda status para uploading
      setQueue((prev) =>
        prev.map((f) => f.id === item.id ? { ...f, status: 'uploading' } : f)
      )

      mockUpload(
        // onProgress
        (p) => setQueue((prev) =>
          prev.map((f) => f.id === item.id ? { ...f, progress: p } : f)
        ),
        // onProcessing (indexando)
        () => setQueue((prev) =>
          prev.map((f) => f.id === item.id ? { ...f, status: 'processing', progress: 100 } : f)
        ),
        // onDone
        () => {
          setQueue((prev) =>
            prev.map((f) => f.id === item.id ? { ...f, status: 'done' } : f)
          )
          setSuccessCount((n) => n + 1)
          setUploading(false)
        }
      )
    })
  }, [queue, metadata])

  const pendingCount  = queue.filter((f) => f.status === 'pending').length
  const allDone       = queue.length > 0 && queue.every((f) => f.status === 'done' || f.status === 'error')

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      {/* Sidebar */}
      <Sidebar
        onNewChat={() => navigate('/chat')}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center gap-3 px-6 py-4
                           border-b border-subtle bg-surface/90 backdrop-blur min-h-[64px]">
          <button
            onClick={() => navigate('/chat')}
            className="p-1.5 rounded-lg text-slate-muted hover:text-slate-soft hover:bg-elevated transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-display font-bold text-base text-slate-soft">
              Envio de documentos
            </h1>
            <p className="text-xs text-slate-muted font-mono">
              Upload · Indexação · RAG
            </p>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 animate-fade-in">

          {/* ── Banner de sucesso ───────────────────────────────────────── */}
          {allDone && successCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl
                            bg-electric-400/10 border border-electric-400/30 animate-slide-up">
              <CheckCircle2 size={18} className="text-accent shrink-0" />
              <div>
                <p className="text-sm font-display font-semibold text-accent">
                  {successCount} documento{successCount > 1 ? 's' : ''} indexado{successCount > 1 ? 's' : ''} com sucesso!
                </p>
                <p className="text-xs text-slate-muted font-mono mt-0.5">
                  Já disponível para busca semântica via RAG
                </p>
              </div>
            </div>
          )}

          {/* ── Seção de upload ─────────────────────────────────────────── */}
          <section className="space-y-5">
            <SectionTitle number="1" label="Selecione os arquivos" />
            <DropZone onFilesSelected={handleFilesSelected} />
          </section>

          {/* ── Metadados ───────────────────────────────────────────────── */}
          <section className="space-y-5">
            <SectionTitle number="2" label="Preencha os metadados" />
            <div className="card">
              <MetadataForm
                values={metadata}
                onChange={setMetadata}
                errors={metaErrors}
              />
            </div>
          </section>

          {/* ── Fila ────────────────────────────────────────────────────── */}
          {queue.length > 0 && (
            <section className="space-y-5 animate-slide-up">
              <SectionTitle number="3" label="Revisar e enviar" />
              <FileQueue files={queue} onRemove={handleRemove} />

              {/* Botão de envio */}
              {pendingCount > 0 && (
                <button
                  onClick={handleUploadAll}
                  disabled={uploading}
                  className={clsx(
                    'w-full flex items-center justify-center gap-2 py-3 rounded-xl',
                    'font-display font-semibold text-sm transition-all duration-200',
                    uploading
                      ? 'bg-electric-400/40 text-ink-950/60 cursor-not-allowed'
                      : 'bg-electric-400 text-ink-950 hover:bg-electric-500 hover:scale-[1.005] active:scale-[0.998] glow-accent'
                  )}
                >
                  <Upload size={16} strokeWidth={2.5} />
                  Enviar {pendingCount} arquivo{pendingCount > 1 ? 's' : ''} e indexar
                </button>
              )}
            </section>
          )}

          {/* ── Documentos já indexados ──────────────────────────────────── */}
          <section className="space-y-4 pt-4 border-t border-subtle">
            <DocumentList />
          </section>

        </div>
      </main>
    </div>
  )
}

function SectionTitle({ number, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-electric-400/15 border border-electric-400/30
                      flex items-center justify-center shrink-0">
        <span className="text-xs font-mono font-bold text-accent">{number}</span>
      </div>
      <h2 className="font-display font-semibold text-sm text-slate-soft">{label}</h2>
    </div>
  )
}
