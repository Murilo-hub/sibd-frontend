/**
 * pages/UploadPage.jsx
 * Upload de documentos conectado ao backend real.
 * Remove mockUpload — usa documentService com API.
 */
import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react'
import Sidebar        from '../components/Sidebar'
import DropZone       from '../components/upload/DropZone'
import MetadataForm   from '../components/upload/MetadataForm'
import FileQueue      from '../components/upload/FileQueue'
import DocumentList   from '../components/upload/DocumentList'
import { documentService } from '../services/documentService'
import { uid } from '../utils'

const EMPTY_META = { empresa: '', categoria: '', data: '', descricao: '' }

export default function UploadPage() {
  const navigate = useNavigate()

  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [queue,        setQueue]        = useState([])
  const [metadata,     setMetadata]     = useState(EMPTY_META)
  const [metaErrors,   setMetaErrors]   = useState({})
  const [uploading,    setUploading]    = useState(false)
  const [successCount, setSuccessCount] = useState(0)

  // ── Estado da lista de documentos ──────────────────────────────────────────
  const [documents,     setDocuments]     = useState([])
  const [docsLoading,   setDocsLoading]   = useState(true)

  // Carrega documentos ao montar e sempre que um upload for concluído
  const loadDocuments = useCallback(async () => {
    setDocsLoading(true)
    try {
      const result = await documentService.list()
      setDocuments(result.items ?? [])
    } catch (err) {
      console.error('Erro ao carregar documentos:', err)
    } finally {
      setDocsLoading(false)
    }
  }, [])

  // Carrega na montagem do componente
  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // ── Fila de upload ──────────────────────────────────────────────────────────
  const handleFilesSelected = useCallback((files) => {
    const newItems = files.map((file) => ({
      id: uid(), file, status: 'pending', progress: 0, error: null,
    }))
    setQueue((prev) => [...prev, ...newItems])
  }, [])

  const handleRemove = useCallback((id) => {
    setQueue((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const validateMeta = () => {
    const errs = {}
    if (!metadata.empresa.trim()) errs.empresa   = 'Campo obrigatório'
    if (!metadata.categoria)      errs.categoria = 'Selecione uma categoria'
    setMetaErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Upload real via API ─────────────────────────────────────────────────────
  const handleUploadAll = useCallback(async () => {
    if (!validateMeta()) return
    const pending = queue.filter((f) => f.status === 'pending')
    if (!pending.length) return

    setUploading(true)
    let doneCount = 0

    for (const item of pending) {
      // Muda para uploading
      setQueue((prev) =>
        prev.map((f) => f.id === item.id ? { ...f, status: 'uploading' } : f)
      )

      try {
        await documentService.upload(
          item.file,
          metadata,
          (progress) => {
            // Atualiza barra de progresso em tempo real
            setQueue((prev) =>
              prev.map((f) => f.id === item.id ? { ...f, progress } : f)
            )
          }
        )

        // Upload concluído — backend indexa em background
        setQueue((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: 'done', progress: 100 } : f
          )
        )
        doneCount++

      } catch (err) {
        const msg = err.response?.data?.detail ?? 'Erro no upload'
        setQueue((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: 'error', error: msg } : f
          )
        )
      }
    }

    setUploading(false)
    if (doneCount > 0) {
      setSuccessCount((c) => c + doneCount)
      // Recarrega lista para mostrar os novos documentos
      await loadDocuments()
      // Agenda um segundo reload após 3s para pegar status "indexed"
      setTimeout(loadDocuments, 3000)
    }
  }, [queue, metadata, loadDocuments])

  // ── Deletar documento ───────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id) => {
    await documentService.delete(id)
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const pendingCount = queue.filter((f) => f.status === 'pending').length

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

          {/* Cabeçalho */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="p-2 rounded-lg text-slate-muted hover:text-slate-soft hover:bg-elevated transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-display font-bold text-xl text-slate-soft">
                Envio de documentos
              </h1>
              <p className="text-xs text-slate-muted font-mono mt-0.5">
                Upload · Indexação · RAG
              </p>
            </div>
          </div>

          {/* Banner de sucesso */}
          {successCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-electric-400/10 border border-electric-400/20 animate-slide-up">
              <CheckCircle2 size={18} className="text-accent shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-soft">
                  {successCount} arquivo{successCount > 1 ? 's' : ''} indexado{successCount > 1 ? 's' : ''} com sucesso!
                </p>
                <p className="text-xs text-slate-muted font-mono mt-0.5">
                  Já disponível para busca semântica via RAG
                </p>
              </div>
            </div>
          )}

          {/* Seção 1 — Selecionar arquivos */}
          <section className="space-y-5">
            <SectionTitle number="1" label="Selecione os arquivos" />
            <DropZone onFilesSelected={handleFilesSelected} />
          </section>

          {/* Seção 2 — Metadados */}
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

          {/* Seção 3 — Fila e envio */}
          {queue.length > 0 && (
            <section className="space-y-5 animate-slide-up">
              <SectionTitle number="3" label="Revisar e enviar" />
              <FileQueue files={queue} onRemove={handleRemove} />

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

          {/* Seção — Documentos indexados */}
          <section className="space-y-4 pt-4 border-t border-subtle">
            <DocumentList
              documents={documents}
              loading={docsLoading}
              onDelete={handleDelete}
              onRefresh={loadDocuments}
            />
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
