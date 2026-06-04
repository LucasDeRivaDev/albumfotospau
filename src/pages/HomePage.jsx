import { useAlbums } from '../hooks/useAlbums'
import { AlbumGrid } from '../components/albums/AlbumGrid'
import { Header } from '../components/layout/Header'

export function HomePage() {
  const { albums, loading, error } = useAlbums()

  return (
    <div style={{ background: 'var(--theme-bg)', minHeight: '100vh' }}>
      <Header />
      <main className="pt-16 px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--theme-text)]">
            Nuestros álbumes
          </h1>
          <p className="text-sm text-[var(--theme-text-muted)] mt-1">
            Recuerdos organizados por momento
          </p>
        </div>
        <AlbumGrid albums={albums} loading={loading} error={error} />
      </main>
    </div>
  )
}
