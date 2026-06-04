import { useEffect, useRef } from 'react'

/**
 * Hook de scroll infinito usando Intersection Observer.
 * Cuando el elemento "sentinel" entra en el viewport, llama a `onIntersect`.
 *
 * Uso:
 *   const sentinelRef = useInfiniteScroll(() => loadMore(), hasMore)
 *   <div ref={sentinelRef} />
 *
 * @param {Function} onIntersect — función a llamar cuando el sentinel es visible
 * @param {boolean} enabled — si es false, no observa (ej: cuando no hay más fotos)
 */
export function useInfiniteScroll(onIntersect, enabled = true) {
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect()
        }
      },
      {
        // Empieza a cargar cuando el sentinel está 200px antes de entrar en pantalla
        rootMargin: '200px',
        threshold: 0,
      }
    )

    const el = sentinelRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [onIntersect, enabled])

  return sentinelRef
}
