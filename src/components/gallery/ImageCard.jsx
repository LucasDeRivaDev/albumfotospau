import { useState } from 'react'
import { getThumbUrl } from '../../api/r2'
import { formatFecha } from '../../utils/formatDate'

/**
 * Tarjeta de imagen con:
 * - Skeleton loading mientras carga
 * - Efecto blur-to-sharp al cargar
 * - Hover que muestra descripción y fecha
 */
export function ImageCard({ photo, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const thumbUrl = getThumbUrl(photo.thumbnail_url)

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-[var(--theme-surface)] animate-fade-in"
      style={{ aspectRatio: '1 / 1' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick() }}
      aria-label={photo.descripcion || 'Ver foto'}
    >
      {/* Skeleton — visible mientras la imagen carga */}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 skeleton" />
      )}

      {/* Fallback si la imagen falla */}
      {imgError && (
        <div className="absolute inset-0 flex items-center justify-center text-[var(--theme-text-muted)] text-3xl">
          📷
        </div>
      )}

      {/* La imagen en sí */}
      {!imgError && (
        <img
          src={thumbUrl}
          alt={photo.descripcion || 'Foto'}
          loading="lazy"
          decoding="async"
          className={`photo-img absolute inset-0 w-full h-full object-cover ${imgLoaded ? 'loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Overlay con info — aparece en hover */}
      <div className={`
        absolute inset-0 flex flex-col justify-end p-2
        bg-gradient-to-t from-black/70 via-transparent to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
      `}>
        {photo.descripcion && (
          <p className="text-white text-xs font-medium leading-tight line-clamp-2">
            {photo.descripcion}
          </p>
        )}
        {photo.fecha && (
          <p className="text-white/70 text-xs mt-0.5">
            {formatFecha(photo.fecha)}
          </p>
        )}
      </div>
    </div>
  )
}
