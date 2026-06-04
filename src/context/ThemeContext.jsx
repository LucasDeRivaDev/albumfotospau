import { createContext, useContext, useEffect, useState } from 'react'

// Los temas disponibles
export const THEMES = {
  default:  { id: 'default',  label: 'Oscuro',    emoji: '🌙' },
  princess: { id: 'princess', label: 'Princesa',   emoji: '👑' },
  dino:     { id: 'dino',     label: 'Dinosaurios',emoji: '🦕' },
  animals:  { id: 'animals',  label: 'Animales',   emoji: '🐾' },
}

// Tags que activan automáticamente un tema si no hay uno manual
const TAG_THEME_MAP = {
  princesa: 'princess',
  princess: 'princess',
  dinosaurio: 'dino',
  dino: 'dino',
  dinosaurios: 'dino',
  animal: 'animals',
  animales: 'animals',
  animals: 'animals',
  mascotas: 'animals',
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Tema guardado manualmente por el usuario (persiste en localStorage)
  const [manualTheme, setManualTheme] = useState(() => {
    return localStorage.getItem('albumpau-theme') || 'default'
  })
  // Tema contextual (lo setea la galería o el álbum activo según sus tags)
  const [contextTheme, setContextTheme] = useState(null)

  // El tema activo: manual tiene prioridad
  const activeTheme = manualTheme !== 'default' ? manualTheme : (contextTheme || 'default')

  // Aplicar el tema al <html> cada vez que cambia
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme)
  }, [activeTheme])

  function setTheme(themeId) {
    setManualTheme(themeId)
    localStorage.setItem('albumpau-theme', themeId)
  }

  // El álbum activo llama esto para sugerir un tema según sus tags
  function suggestThemeFromTags(tags = []) {
    if (!tags.length) {
      setContextTheme(null)
      return
    }
    for (const tag of tags) {
      const theme = TAG_THEME_MAP[tag.toLowerCase()]
      if (theme) {
        setContextTheme(theme)
        return
      }
    }
    setContextTheme(null)
  }

  return (
    <ThemeContext.Provider value={{
      activeTheme,
      manualTheme,
      setTheme,
      suggestThemeFromTags,
      themes: THEMES,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
