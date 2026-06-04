import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError('Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--theme-bg)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 animate-scale-in"
        style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📸</div>
          <h1 className="text-xl font-bold text-[var(--theme-text)]">AlbumPau</h1>
          <p className="text-sm text-[var(--theme-text-muted)] mt-1">
            Galería privada familiar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-[var(--theme-text-muted)] mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="
                w-full px-3 py-2.5 rounded-lg text-sm outline-none
                text-[var(--theme-text)]
                bg-[var(--theme-bg)]
                border border-[var(--theme-border)]
                focus:border-[var(--theme-accent)]
                transition-colors
              "
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[var(--theme-text-muted)] mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="
                w-full px-3 py-2.5 rounded-lg text-sm outline-none
                text-[var(--theme-text)]
                bg-[var(--theme-bg)]
                border border-[var(--theme-border)]
                focus:border-[var(--theme-accent)]
                transition-colors
              "
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5 rounded-lg text-sm font-semibold text-white
              transition-opacity duration-150
              disabled:opacity-60
            "
            style={{ background: 'var(--theme-accent)' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
