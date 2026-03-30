/**
 * components/auth/DecorativePanel.jsx
 * Painel decorativo animado para as páginas de autenticação.
 * Aparece apenas em telas lg+.
 */
export default function DecorativePanel() {
  return (
    <div className="hidden lg:flex w-[480px] shrink-0 relative flex-col
                    bg-ink-900 border-r border-subtle overflow-hidden">

      {/* ── Grade de fundo ─────────────────────────────────────────────── */}
      <GridBackground />

      {/* ── Conteúdo central ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-between h-full px-12 py-14">

        {/* Logo */}
        <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          <PanelLogo />
          <span className="font-display font-bold text-2xl gradient-text tracking-tight">
            SIBD
          </span>
        </div>

        {/* Texto central */}
        <div className="space-y-6">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-3">
              Sistema Inteligente
            </p>
            <h2 className="font-display font-bold text-4xl leading-tight text-slate-soft">
              Seus documentos,{' '}
              <span className="gradient-text">encontrados</span>{' '}
              em segundos.
            </h2>
          </div>

          <p
            className="text-slate-muted text-sm leading-relaxed max-w-xs animate-slide-up"
            style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Busca semântica com IA sobre toda a sua base documental corporativa.
            Pergunte em linguagem natural, receba respostas fundamentadas.
          </p>

          {/* Features */}
          <ul
            className="space-y-2.5 animate-slide-up"
            style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}
          >
            {[
              'Recuperação via RAG com LLMs',
              'Busca por metadados e semântica',
              'Referências documentais rastreáveis',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Rodapé */}
        <p
          className="text-xs font-mono text-slate-muted/50 animate-fade-in"
          style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}
        >
          © {new Date().getFullYear()} SIBD — Todos os direitos reservados
        </p>
      </div>

      {/* ── Orbs decorativos ───────────────────────────────────────────── */}
      <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 rounded-full
                      bg-electric-400/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full
                      bg-electric-400/8 blur-2xl pointer-events-none" />
    </div>
  )
}

/* ── Grade de pontos no fundo ──────────────────────────────────────────────── */
function GridBackground() {
  const COLS = 12
  const ROWS = 18
  const dots = Array.from({ length: COLS * ROWS })

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fadeGrad" cx="50%" cy="60%" r="60%">
            <stop offset="0%"   stopColor="#0a0b0f" stopOpacity="0" />
            <stop offset="100%" stopColor="#0a0b0f" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Linhas horizontais sutis */}
        {Array.from({ length: ROWS }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0" y1={`${(i / ROWS) * 100}%`}
            x2="100%" y2={`${(i / ROWS) * 100}%`}
            stroke="rgba(77,240,192,0.04)" strokeWidth="1"
          />
        ))}

        {/* Linhas verticais sutis */}
        {Array.from({ length: COLS }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={`${(i / COLS) * 100}%`} y1="0"
            x2={`${(i / COLS) * 100}%`} y2="100%"
            stroke="rgba(77,240,192,0.04)" strokeWidth="1"
          />
        ))}

        {/* Pontos nas interseções */}
        {Array.from({ length: COLS }).map((_, ci) =>
          Array.from({ length: ROWS }).map((_, ri) => (
            <circle
              key={`d${ci}${ri}`}
              cx={`${(ci / COLS) * 100}%`}
              cy={`${(ri / ROWS) * 100}%`}
              r="1.2"
              fill="rgba(77,240,192,0.12)"
            />
          ))
        )}

        {/* Fade overlay para escurecer as bordas */}
        <rect width="100%" height="100%" fill="url(#fadeGrad)" />
      </svg>

      {/* Linha de destaque diagonal */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.12 }}
      >
        <line x1="0" y1="35%" x2="100%" y2="65%"
              stroke="#4df0c0" strokeWidth="1" strokeDasharray="6 10" />
        <line x1="0" y1="42%" x2="100%" y2="72%"
              stroke="#4df0c0" strokeWidth="0.5" strokeDasharray="4 14" />
      </svg>
    </div>
  )
}

function PanelLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="7" fill="rgba(77,240,192,0.15)" />
      <path d="M6 8h7M6 12h12M6 16h9" stroke="#4df0c0" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="16" r="3" fill="none" stroke="#4df0c0" strokeWidth="1.5" />
      <path d="M20.2 18.2l1.5 1.5" stroke="#4df0c0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
