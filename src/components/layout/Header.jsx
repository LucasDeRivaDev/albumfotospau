import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme, THEMES } from '../../context/ThemeContext'

export function Header() {
  const { user, signOut } = useAuth()
  const { activeTheme, setTheme, themes } = useTheme()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6"
      style={{
        background: 'var(--theme-surface)',
        borderBottom: '1px solid var(--theme-border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-lg text-[var(--theme-text)]">
        <span className="text-2xl">📸</span>
        <span>AlbumPau</span>
      </Link>

      {/* Navegación central */}
      <nav className="hidden sm:flex items-center gap-1">
        <NavLink to="/">Álbumes</NavLink>
        <NavLink to="/galeria">Todas las fotos</NavLink>
      </nav>

      {/* Controles derecha */}
      <div className="flex items-center gap-2">
        {/* Selector de tema */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
          {Object.values(themes).map(theme => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              title={theme.label}
              className={`
                w-8 h-8 rounded-md flex items-center justify-center text-lg
                transition-all duration-150
                ${activeTheme === theme.id
                  ? 'bg-[var(--theme-accent)] shadow-sm'
                  : 'hover:bg-[var(--theme-border)]'
                }
              `}
            >
              {theme.emoji}
            </button>
          ))}
        </div>

        {/* Botón logout */}
        {user && (
          <button
            onClick={handleSignOut}
            className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] px-3 py-1.5 rounded-lg hover:bg-[var(--theme-border)] transition-colors"
          >
            Salir
          </button>
        )}
      </div>
    </header>
  )
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-lg text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-border)] transition-colors"
    >
      {children}
    </Link>
  )
}
