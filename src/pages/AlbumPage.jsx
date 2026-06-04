import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAlbum } from '../hooks/useAlbums'
import { usePhotos } from '../hooks/usePhotos'
import { useTheme } from '../context/ThemeContext'
import { Gallery } from '../components/gallery/Gallery'
import { Header } from '../components/layout/Header'
import { TagBadge } from '../components/ui/TagBadge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { formatMesAnio } from '../utils/formatDate'

export function AlbumPage() {
  const { albumId } = useParams()
  const { album, loading: loadingAlbum } = useAlbum(albumId)
  const { suggestThemeFromTags } = useTheme()

  const {
    photos, loading, loadingMore, error, hasMore,
    loadPhotos, loadMore,
  } = usePhotos({ albumId })

  // Al cargar el álbum, sugerir tema según sus tags
  useEffect(() => {
    if (album?.tags) {
      suggestThemeFromTags(album.tags)
    }
    // Al salir del álbum, limpiar la sugerencia
    return () => suggestThemeFromTags([])
  }, [album, suggestThemeFromTags])

  // Cargar fotos cuando tengamos el albumId
  useEffect(() => {
    if (albumId) loadPhotos()
  }, [albumId, loadPhotos])

  if (loadingAlbum) {
    return (
      <div style={{ background: 'var(--theme-bg)', minHeight: '100vh' }}>
        <Header />
        <div className="pt-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--theme-bg)', minHeight: '100vh' }}>
      <Header />

      {/* Info del álbum */}
      <div className="pt-16 px-4 sm:px-6 py-5 max-w-7xl mx-auto">
        <Link
          to="/"
          className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] mb-3 inline-flex items-center gap-1 transition-colors"
        >
          ← Volver a álbumes
        </Link>
        {album && (
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[var(--theme-text)]">
                {album.nombre}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {album.year && (
                  <span className="text-sm text-[var(--theme-text-muted)]">
                    {formatMesAnio(album.year, album.month)}
                  </span>
                )}
                {album.descripcion && (
                  <span className="text-sm text-[var(--theme-text-muted)]">
                    {album.descripcion}
                  </span>
                )}
              </div>
              {album.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {album.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* La galería toma el resto de la pantalla */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Gallery
          photos={photos}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          emptyMessage="Este álbum no tiene fotos todavía."
        />
      </div>
    </div>
  )
}
