import { Link } from 'react-router-dom'
import { getPhotoUrl } from '../../api/r2'
import { formatMesAnio } from '../../utils/formatDate'
import { TagBadge } from '../ui/TagBadge'

export function AlbumCard({ album }) {
  const coverUrl = album.cover_url ? getPhotoUrl(album.cover_url) : null

  return (
    <Link
      to={`/album/${album.id}`}
      className="group block rounded-xl overflow-hidden bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] transition-all duration-200 hover:-translate-y-1"
    >
      {/* Cover del álbum */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={album.nombre}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--theme-border)] text-5xl">
            📁
          </div>
        )}
        {/* Badge de fecha sobre la imagen */}
        {album.year && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {formatMesAnio(album.year, album.month)}
          </div>
        )}
      </div>

      {/* Info del álbum */}
      <div className="p-3">
        <h3 className="font-semibold text-[var(--theme-text)] text-sm truncate">
          {album.nombre}
        </h3>
        {album.descripcion && (
          <p className="text-[var(--theme-text-muted)] text-xs mt-0.5 line-clamp-2">
            {album.descripcion}
          </p>
        )}
        {/* Tags */}
        {album.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {album.tags.slice(0, 3).map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {album.tags.length > 3 && (
              <span className="text-[var(--theme-text-muted)] text-xs self-center">
                +{album.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
