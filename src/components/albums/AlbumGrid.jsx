import { AlbumCard } from './AlbumCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function AlbumGrid({ albums, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-16 gap-2 text-[var(--theme-text-muted)]">
        <span className="text-4xl">⚠️</span>
        <p className="text-sm">Error cargando álbumes: {error}</p>
      </div>
    )
  }

  if (!albums.length) {
    return (
      <div className="flex flex-col items-center py-16 gap-2 text-[var(--theme-text-muted)]">
        <span className="text-5xl">📂</span>
        <p className="text-sm">Todavía no hay álbumes creados.</p>
      </div>
    )
  }

  // Agrupamos álbumes por año para mostrarlos organizados
  const byYear = albums.reduce((acc, album) => {
    const year = album.year || 'Sin fecha'
    if (!acc[year]) acc[year] = []
    acc[year].push(album)
    return acc
  }, {})

  const years = Object.keys(byYear).sort((a, b) => b - a)

  return (
    <div className="space-y-8">
      {years.map(year => (
        <section key={year}>
          <h2 className="text-lg font-bold text-[var(--theme-text)] mb-4 flex items-center gap-2">
            <span className="text-[var(--theme-accent)]">{year}</span>
            <span className="text-[var(--theme-text-muted)] text-sm font-normal">
              ({byYear[year].length} álbumes)
            </span>
          </h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {byYear[year].map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
