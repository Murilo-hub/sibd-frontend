/**
 * components/upload/MetadataForm.jsx
 * Formulário de metadados preenchido antes de enviar o arquivo.
 * Empresa, categoria, tipo e data do documento.
 */
import { clsx } from 'clsx'

const CATEGORIAS = [
  'Societário', 'Financeiro', 'Compliance', 'Contratos',
  'Governança', 'RH', 'Jurídico', 'Operacional', 'Outro',
]

const TIPOS = ['PDF', 'DOCX', 'DOC', 'TXT']

export default function MetadataForm({ values, onChange, errors }) {
  const field = (name) => ({
    value: values[name] ?? '',
    onChange: (e) => onChange({ ...values, [name]: e.target.value }),
  })

  return (
    <div className="space-y-4">
      <p className="text-xs font-mono text-slate-muted uppercase tracking-wider">
        Metadados do documento
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Empresa */}
        <div>
          <label className="block text-xs font-mono text-slate-muted mb-1.5 uppercase tracking-wide">
            Empresa <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: XYZ Ltda"
            {...field('empresa')}
            className={clsx('input-base', errors?.empresa && 'border-red-500/60')}
          />
          {errors?.empresa && (
            <p className="mt-1 text-xs text-red-400 font-mono">{errors.empresa}</p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-xs font-mono text-slate-muted mb-1.5 uppercase tracking-wide">
            Categoria <span className="text-red-400">*</span>
          </label>
          <select
            {...field('categoria')}
            className={clsx('input-base', errors?.categoria && 'border-red-500/60')}
          >
            <option value="">Selecione...</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors?.categoria && (
            <p className="mt-1 text-xs text-red-400 font-mono">{errors.categoria}</p>
          )}
        </div>

        {/* Data do documento */}
        <div>
          <label className="block text-xs font-mono text-slate-muted mb-1.5 uppercase tracking-wide">
            Data do documento
          </label>
          <input
            type="date"
            {...field('data')}
            className="input-base"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-mono text-slate-muted mb-1.5 uppercase tracking-wide">
            Descrição (opcional)
          </label>
          <input
            type="text"
            placeholder="Breve descrição..."
            {...field('descricao')}
            className="input-base"
          />
        </div>
      </div>
    </div>
  )
}
