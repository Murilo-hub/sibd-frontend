/**
 * components/ProtectedRoute.jsx
 * Redireciona para /login se o usuário não estiver autenticado.
 * Quando o backend estiver pronto, a validação do token acontece aqui.
 */
import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'

export default function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!authService.isAuthenticated()) {
    // Salva a rota tentada para redirecionar depois do login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
