/**
 * pages/LoginPage.jsx
 * Tela de login: split-screen com painel decorativo animado (esquerda)
 * e formulário de acesso (direita).
 */
import { useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { clsx } from 'clsx'
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import DecorativePanel from '../components/auth/DecorativePanel'

export default function LoginPage() {
  const navigate  = useNavigate()
  const { login, loading, error } = useAuth()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/chat'
  const [searchParams] = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'

  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [fieldError, setFieldError] = useState({})

  const validate = () => {
    const errs = {}
    if (!email.trim())               errs.email    = 'Informe seu e-mail'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'E-mail inválido'
    if (!password)                   errs.password = 'Informe sua senha'
    setFieldError(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const ok = await login(email, password)
    if (ok) navigate(from, { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      {/* ── Painel esquerdo decorativo ──────────────────────────────────── */}
      <DecorativePanel />

      {/* ── Formulário ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm animate-slide-up">

          {/* Logo mobile (aparece só quando o painel esquerdo some) */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <LogoIcon />
            <span className="font-display font-bold text-xl gradient-text">SIBD</span>
          </div>

          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-slate-soft leading-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-muted text-sm mt-2">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Banner de conta criada */}
          {justRegistered && (
            <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg
                            bg-electric-400/10 border border-electric-400/30 text-accent text-sm animate-fade-in">
              <span>✓</span> Conta criada! Faça login para continuar.
            </div>
          )}

          {/* Erro global da API */}
          {error && (
            <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg
                            bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* E-mail */}
            <div>
              <label className="block text-xs font-mono text-slate-muted mb-1.5 uppercase tracking-wide">
                E-mail
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldError((p) => ({ ...p, email: '' })) }}
                placeholder="voce@empresa.com"
                className={clsx(
                  'input-base',
                  fieldError.email && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                )}
              />
              {fieldError.email && (
                <p className="mt-1 text-xs text-red-400 font-mono">{fieldError.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-muted uppercase tracking-wide">
                  Senha
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-accent hover:text-electric-500 transition-colors font-mono"
                >
                  Esqueci a senha
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldError((p) => ({ ...p, password: '' })) }}
                  placeholder="••••••••"
                  className={clsx(
                    'input-base pr-10',
                    fieldError.password && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted hover:text-slate-soft transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldError.password && (
                <p className="mt-1 text-xs text-red-400 font-mono">{fieldError.password}</p>
              )}
            </div>

            {/* Botão de entrar */}
            <button
              type="submit"
              disabled={loading}
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-3 rounded-lg mt-2',
                'font-display font-semibold text-sm transition-all duration-200',
                loading
                  ? 'bg-electric-400/50 text-ink-950/70 cursor-not-allowed'
                  : 'bg-electric-400 text-ink-950 hover:bg-electric-500 hover:scale-[1.01] active:scale-[0.99]'
              )}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Entrando...</>
                : <><span>Entrar</span><ArrowRight size={15} strokeWidth={2.5} /></>
              }
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ink-700" />
            <span className="text-xs font-mono text-slate-muted">ou</span>
            <div className="flex-1 h-px bg-ink-700" />
          </div>

          {/* Link para cadastro */}
          <p className="text-center text-sm text-slate-muted">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-accent hover:text-electric-500 font-semibold transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(77,240,192,0.12)" />
      <path d="M6 8h7M6 12h12M6 16h9" stroke="#4df0c0" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="16" r="3" fill="none" stroke="#4df0c0" strokeWidth="1.5" />
      <path d="M20.2 18.2l1.5 1.5" stroke="#4df0c0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
