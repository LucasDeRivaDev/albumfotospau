import { useEffect, useState } from 'react'
import { usePhotos } from '../hooks/usePhotos'
import { Gallery } from '../components/gallery/Gallery'
import { Header } from '../components/layout/Header'
import { TagBadge } from '../components/ui/TagBadge'

// Tags disponibles para filtrar
const AVAILABLE_TAGS = ['princesa', 'dinosaurio', 'animales', 'familia', 'cumpleaños', 'playa', 'viaje']

export function GalleryPage() {
  const [selectedTags, setSelectedTags] = useState([])
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce del search para no consultar en cada tecla
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 400)
    return () => clearTimeout(timer)
  }, [searchText])

  const filters = {
    tags: selectedTags.length ? selectedTags : undefined,
    search: debouncedSearch || undefined,
  }

  const { photos, loading, loadingMore, error, hasMore, loadPhotos, loadMore } = usePhotos(filters)

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  function toggleTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div style={{ background: 'var(--theme-bg)', minHeight: '100vh' }}>
      <Header />

      {/* Filtros */}
      <div className="pt-16 px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Buscador */}
          <input
            type="search"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Buscar en descripciones..."
            className="
              px-3 py-2 rounded-lg text-sm outline-none w-full sm:w-64
              text-[var(--theme-text)]
              bg-[var(--theme-surface)]
              border border-[var(--theme-border)]
              focus:border-[var(--theme-accent)]
              transition-colors
            "
          />

          {/* Filtros de tags */}
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map(tag => (
              <TagBadge
                key={tag}
                tag={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] px-2 py-1 rounded-full hover:bg-[var(--theme-border)] transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Galería */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Gallery
          photos={photos}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          emptyMessage={
            selectedTags.length || debouncedSearch
              ? 'No hay fotos que coincidan con los filtros.'
              : 'No hay fotos todavía.'
          }
        />
      </div>
    </div>
  )
}
