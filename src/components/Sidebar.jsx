/**
 * components/Sidebar.jsx
 * Painel lateral: logo, botão de novo chat, histórico de conversas e ações do usuário.
 */
import { useState } from 'react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'
import {
  Plus, MessageSquare, FileText, ChevronRight,
  LogOut, Settings, Search, Clock
} from 'lucide-react'

// ── Mock de histórico ─────────────────────────────────────────────────────────
const MOCK_HISTORY = [
  { id: 1, title: 'Contrato Social Empresa XYZ', date: 'Hoje', active: true },
  { id: 2, title: 'Relatório financeiro Q3 2024', date: 'Hoje' },
  { id: 3, title: 'Política de privacidade atualizada', date: 'Ontem' },
  { id: 4, title: 'Ata reunião board outubro', date: 'Ontem' },
  { id: 5, title: 'NDA fornecedor Alpha Ltda', date: '22 jan' },
  { id: 6, title: 'Manual de compliance interno', date: '18 jan' },
  { id: 7, title: 'Balanço patrimonial 2023', date: '10 jan' },
]

export default function Sidebar({ onNewChat, collapsed, onToggle }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const filtered = MOCK_HISTORY.filter((h) =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside
      className={clsx(
        'flex flex-col h-full transition-all duration-300 ease-in-out',
        'bg-surface border-r border-subtle',
        collapsed ? 'w-14' : 'w-64'
      )}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-subtle min-h-[64px]">
        <LogoIcon />
        {!collapsed && (
          <span className="font-display font-bold text-lg gradient-text tracking-tight leading-none">
            SIBD
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-md text-slate-muted hover:text-slate-soft hover:bg-elevated transition-colors"
          title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          <ChevronRight
            size={16}
            className={clsx('transition-transform duration-300', !collapsed && 'rotate-180')}
          />
        </button>
      </div>

      {/* ── Novo chat ────────────────────────────────────────────────────── */}
      <div className="px-3 py-3">
        <button
          onClick={onNewChat}
          className={clsx(
            'w-full flex items-center gap-2.5 rounded-lg transition-all duration-200',
            'bg-electric-400 text-ink-950 font-display font-semibold text-sm',
            'hover:bg-electric-500 active:scale-[0.98]',
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
          )}
        >
          <Plus size={16} strokeWidth={2.5} />
          {!collapsed && <span>Nova consulta</span>}
        </button>
      </div>

      {/* ── Busca no histórico ────────────────────────────────────────────── */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
            <input
              type="text"
              placeholder="Buscar histórico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-8 py-1.5 text-xs"
            />
          </div>
        </div>
      )}

      {/* ── Histórico ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {!collapsed && (
          <p className="px-2 py-1.5 text-xs font-mono text-slate-muted uppercase tracking-wider">
            Recentes
          </p>
        )}

        {filtered.map((item) => (
          <button
            key={item.id}
            className={clsx(
              'w-full flex items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-all duration-150',
              item.active
                ? 'bg-elevated text-slate-soft border border-ink-700/60'
                : 'text-slate-muted hover:bg-elevated hover:text-slate-soft'
            )}
            title={collapsed ? item.title : undefined}
          >
            <MessageSquare
              size={14}
              className={clsx('mt-0.5 shrink-0', item.active ? 'text-accent' : '')}
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-snug truncate">{item.title}</p>
                <span className="text-[11px] font-mono text-slate-muted">{item.date}</span>
              </div>
            )}
          </button>
        ))}

        {!collapsed && filtered.length === 0 && (
          <p className="px-2 py-4 text-xs text-slate-muted text-center">
            Nenhuma conversa encontrada
          </p>
        )}
      </div>

      {/* ── Rodapé ───────────────────────────────────────────────────────── */}
      <div className="border-t border-subtle px-2 py-3 space-y-0.5">
        <SidebarFooterBtn icon={<FileText size={15} />} label="Documentos" collapsed={collapsed} onClick={() => navigate('/upload')} />
        <SidebarFooterBtn icon={<Clock size={15} />} label="Histórico" collapsed={collapsed} />
        <SidebarFooterBtn icon={<Settings size={15} />} label="Configurações" collapsed={collapsed} />

        {/* Avatar / logout */}
        <div className="flex items-center gap-2.5 px-2 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-electric-400/20 border border-electric-400/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-display font-bold text-accent">U</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-soft truncate">Usuário</p>
                <p className="text-[11px] text-slate-muted truncate">usuario@empresa.com</p>
              </div>
              <button className="p-1 rounded text-slate-muted hover:text-slate-soft transition-colors" title="Sair">
                <LogOut size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

function SidebarFooterBtn({ icon, label, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-slate-muted',
        'hover:bg-elevated hover:text-slate-soft transition-all duration-150 text-sm',
        collapsed && 'justify-center'
      )}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span className="text-xs">{label}</span>}
    </button>
  )
}

function LogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect width="24" height="24" rx="6" fill="rgba(77,240,192,0.12)" />
      <path d="M6 8h7M6 12h12M6 16h9" stroke="#4df0c0" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="16" r="3" fill="none" stroke="#4df0c0" strokeWidth="1.5" />
      <path d="M20.2 18.2l1.5 1.5" stroke="#4df0c0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
