/**
 * utils/index.js
 * Funções utilitárias gerais do projeto.
 */

/** Formata data ISO para dd/mm/yyyy HH:MM */
export function formatDate(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/** Trunca texto em N caracteres com reticências */
export function truncate(text = '', maxLength = 80) {
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}

/** Retorna ícone/label por extensão de arquivo */
export function fileTypeInfo(filename = '') {
  const ext = filename.split('.').pop().toLowerCase()
  const map = {
    pdf:  { label: 'PDF',  color: '#f87171' },
    doc:  { label: 'DOC',  color: '#60a5fa' },
    docx: { label: 'DOCX', color: '#60a5fa' },
    txt:  { label: 'TXT',  color: '#a3e635' },
    xlsx: { label: 'XLSX', color: '#34d399' },
    csv:  { label: 'CSV',  color: '#34d399' },
  }
  return map[ext] ?? { label: ext.toUpperCase(), color: '#8892a4' }
}

/** Formata bytes em KB / MB */
export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Gera ID único simples */
export function uid() {
  return Math.random().toString(36).slice(2, 10)
}
