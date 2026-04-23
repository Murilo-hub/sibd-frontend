import { Routes, Route, Navigate } from 'react-router-dom'
import ChatPage       from './pages/ChatPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import UploadPage     from './pages/UploadPage'
import ProtectedRoute from './components/ProtectedRoute'

function Placeholder({ label }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="font-display text-3xl font-bold gradient-text">SIBD</p>
        <p className="text-slate-muted font-mono text-sm">/{label}</p>
        <p className="text-slate-soft text-sm">Página em construção</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Raiz → chat (protegido) */}
      <Route path="/" element={<Navigate to="/chat" replace />} />

      {/* Autenticação (rotas públicas) */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App principal (protegido por JWT) */}
      <Route path="/chat" element={
        <ProtectedRoute><ChatPage /></ProtectedRoute>
      } />
      <Route path="/upload" element={
        <ProtectedRoute><UploadPage /></ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Placeholder label="404" />} />
    </Routes>
  )
}
