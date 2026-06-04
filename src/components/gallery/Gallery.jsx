import { useState, useRef, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ImageCard } from './ImageCard'
import { ModalViewer } from './ModalViewer'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

// Tamaño base de cada celda en la grilla (thumbnail + gap)
const CELL_SIZE = 220
const GAP = 8

/**
 * Galería virtualizada con scroll infinito.
 *
 * La virtualización es CLAVE para 10k+ fotos:
 * solo renderiza las filas visibles en pantalla,
 * el resto existe solo como espacio vacío en el DOM.
 */
export function Gallery({ photos, loading, loadingMore, hasMore, onLoadMore, emptyMessage }) {
  const [modalIndex, setModalIndex] = useState(null)
  const parentRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(800)

  // Calcular columnas según el ancho real del contenedor
  useEffect(() => {
    if (!parentRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(parentRef.current)
    return () => observer.disconnect()
  }, [])

  const cols = Math.max(2, Math.floor(containerWidth / CELL_SIZE))
  const cellSize = Math.floor((containerWidth - (cols - 1) * GAP) / cols)
  const rows = Math.ceil(photos.length / cols)

  // Virtualizador de filas — solo renderiza las visibles
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => cellSize + GAP,
    overscan: 2, // renderiza 2 filas extra arriba y abajo para evitar flashes
  })

  // Sentinel para infinite scroll
  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore && !loadingMore)

  function openModal(photoIndex) {
    setModalIndex(photoIndex)
  }

  // Pantalla de carga inicial
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Sin resultados
  if (!photos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-[var(--theme-text-muted)]">
        <span className="text-5xl">📭</span>
        <p className="text-sm">{emptyMessage || 'No hay fotos en este álbum todavía.'}</p>
      </div>
    )
  }

  return (
    <>
      {/* Contenedor scrolleable — la altura es del viewport */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: 'calc(100vh - 64px)' }} // 64px = altura del header
      >
        {/* Espacio total virtual — hace que el scrollbar sea del tamaño correcto */}
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: 'relative',
            padding: `${GAP}px`,
          }}
        >
          {/* Solo las filas visibles */}
          {rowVirtualizer.getVirtualItems().map(virtualRow => (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: virtualRow.start + GAP,
                left: GAP,
                right: GAP,
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                gap: GAP,
              }}
            >
              {Array.from({ length: cols }, (_, colIdx) => {
                const photoIdx = virtualRow.index * cols + colIdx
                const photo = photos[photoIdx]
                if (!photo) return <div key={colIdx} style={{ width: cellSize, height: cellSize }} />
                return (
                  <div key={photo.id} style={{ width: cellSize, height: cellSize }}>
                    <ImageCard
                      photo={photo}
                      onClick={() => openModal(photoIdx)}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Spinner de carga de más fotos */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Sentinel invisible — al entrar al viewport dispara la carga de más fotos */}
        <div ref={sentinelRef} style={{ height: 1 }} />

        {/* Fin de la galería */}
        {!hasMore && photos.length > 0 && (
          <p className="text-center text-[var(--theme-text-muted)] text-xs py-6">
            {photos.length} fotos en total
          </p>
        )}
      </div>

      {/* Modal de foto completa */}
      {modalIndex !== null && (
        <ModalViewer
          photos={photos}
          initialIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </>
  )
}
