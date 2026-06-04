import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingScreen } from './LoadingSpinner'

/**
 * Wrapper que protege rutas privadas.
 * Si no hay sesión → redirige al login.
 * Si está cargando → muestra spinner.
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  return children
}
