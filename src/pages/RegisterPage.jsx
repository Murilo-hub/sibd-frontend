/**
 * pages/RegisterPage.jsx
 * Tela de cadastro de novo usuário.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import DecorativePanel from '../components/auth/DecorativePanel'

/* Regras de senha */
const passwordRules = [
  { label: 'Mínimo 8 caracteres', test: (v) => v.length >= 8 },
  { label: 'Letra maiúscula',      test: (v) => /[A-Z]/.test(v) },
  { label: 'Número',               test: (v) => /\d/.test(v) },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()

  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [fieldError, setFieldError] = useState({})

  const passStrength = passwordRules.filter((r) => r.test(password)).length

  const validate = () => {
    const errs = {}
    if (!name.trim())                     errs.name     = 'Informe seu nome'
    if (!email.trim())                    errs.email    = 'Informe seu e-mail'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email    = 'E-mail inválido'
    if (!password)                        errs.password = 'Crie uma senha'
    else if (passStrength < 3)            errs.password = 'A senha não atende aos requisitos'
    setFieldError(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const ok = await register(name, email, password)
    if (ok) navigate('/login?registered=1')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <DecorativePanel />

      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm animate-slide-up">

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <LogoIcon />
            <span className="font-display font-bold text-xl gradient-text">SIBD</span>
          </div>

          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-slate-soft leading-tight">
              Criar conta
            </h1>
            <p className="text-slate-muted text-sm mt-2">
              Preencha os dados para acessar o sistema
            </p>
          </div>

          {/* Erro global da API */}
          {error && (
            <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg
                            bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Nome */}
            <div>
              <label className="block text-xs font-mono text-slate-muted mb-1.5 uppercase tracking-wide">
                Nome completo
              </label>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldError((p) => ({ ...p, name: '' })) }}
                placeholder="Seu nome"
                className={clsx('input-base', fieldError.name && 'border-red-500/60')}
              />
              {fieldError.name && (
                <p className="mt-1 text-xs text-red-400 font-mono">{fieldError.name}</p>
              )}
            </div>

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
                className={clsx('input-base', fieldError.email && 'border-red-500/60')}
              />
              {fieldError.email && (
                <p className="mt-1 text-xs text-red-400 font-mono">{fieldError.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-mono text-slate-muted mb-1.5 uppercase tracking-wide">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldError((p) => ({ ...p, password: '' })) }}
                  placeholder="••••••••"
                  className={clsx('input-base pr-10', fieldError.password && 'border-red-500/60')}
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

              {/* Força da senha */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5 animate-fade-in">
                  {/* Barra de progresso */}
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={clsx(
                          'flex-1 h-1 rounded-full transition-all duration-300',
                          i < passStrength
                            ? passStrength === 1 ? 'bg-red-500'
                            : passStrength === 2 ? 'bg-yellow-500'
                            : 'bg-electric-400'
                            : 'bg-ink-700'
                        )}
                      />
                    ))}
                  </div>
                  {/* Checklist de requisitos */}
                  <ul className="space-y-0.5">
                    {passwordRules.map((rule) => (
                      <li
                        key={rule.label}
                        className={clsx(
                          'flex items-center gap-1.5 text-xs font-mono transition-colors',
                          rule.test(password) ? 'text-electric-400' : 'text-slate-muted'
                        )}
                      >
                        <Check size={10} />
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {fieldError.password && (
                <p className="mt-1 text-xs text-red-400 font-mono">{fieldError.password}</p>
              )}
            </div>

            {/* Botão */}
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
                ? <><Loader2 size={15} className="animate-spin" /> Criando conta...</>
                : <><span>Criar conta</span><ArrowRight size={15} strokeWidth={2.5} /></>
              }
            </button>
          </form>

          {/* Link para login */}
          <p className="text-center text-sm text-slate-muted mt-6">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-accent hover:text-electric-500 font-semibold transition-colors"
            >
              Entrar
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
