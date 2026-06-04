import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ui/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { AlbumPage } from './pages/AlbumPage'
import { GalleryPage } from './pages/GalleryPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Privadas — redirigen al login si no hay sesión */}
            <Route path="/" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
            <Route path="/album/:albumId" element={
              <ProtectedRoute><AlbumPage /></ProtectedRoute>
            } />
            <Route path="/galeria" element={
              <ProtectedRoute><GalleryPage /></ProtectedRoute>
            } />

            {/* Cualquier ruta desconocida → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
