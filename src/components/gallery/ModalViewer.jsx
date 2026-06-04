import { useEffect, useRef, useState } from 'react'
import { getPhotoUrl } from '../../api/r2'
import { formatFecha } from '../../utils/formatDate'
import { TagBadge } from '../ui/TagBadge'

/**
 * Modal fullscreen para ver la imagen completa.
 * Soporte para:
 * - Navegación con flechas del teclado
 * - Swipe en mobile
 * - Cerrar con Escape o click fuera
 * - Transición suave entre fotos
 */
export function ModalViewer({ photos, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [imgLoaded, setImgLoaded] = useState(false)
  const touchStartX = useRef(null)

  const photo = photos[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  // Navegar
  function goPrev() {
    if (hasPrev) {
      setImgLoaded(false)
      setCurrentIndex(i => i - 1)
    }
  }

  function goNext() {
    if (hasNext) {
      setImgLoaded(false)
      setCurrentIndex(i => i + 1)
    }
  }

  // Teclado
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Touch swipe
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'var(--theme-overlay)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Click en el fondo para cerrar */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        aria-label="Cerrar"
      >
        ×
      </button>

      {/* Botón anterior */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-2 sm:left-6 z-10 text-white/80 hover:text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Anterior"
        >
          ‹
        </button>
      )}

      {/* Botón siguiente */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-2 sm:right-6 z-10 text-white/80 hover:text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Siguiente"
        >
          ›
        </button>
      )}

      {/* Contenedor de imagen + info */}
      <div
        className="relative z-10 flex flex-col max-w-5xl max-h-screen w-full px-16 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen */}
        <div className="relative flex items-center justify-center" style={{ maxHeight: '80vh' }}>
          {!imgLoaded && (
            <div className="w-96 h-72 skeleton rounded-lg" />
          )}
          <img
            key={photo.id}
            src={getPhotoUrl(photo.url)}
            alt={photo.descripcion || 'Foto'}
            className={`photo-img max-h-[80vh] max-w-full object-contain rounded-lg ${imgLoaded ? 'loaded' : ''}`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        {/* Info debajo de la imagen */}
        <div className="mt-3 px-2">
          {photo.descripcion && (
            <p className="text-white text-sm mb-1">{photo.descripcion}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {photo.fecha && (
              <span className="text-white/60 text-xs">{formatFecha(photo.fecha)}</span>
            )}
            {photo.tags?.map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          {/* Contador de posición */}
          <p className="text-white/40 text-xs mt-1">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </div>
    </div>
  )
}
