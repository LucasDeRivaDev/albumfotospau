import { useState, useCallback } from 'react'
import { supabase } from '../api/supabase'

const PAGE_SIZE = 24 // fotos por página (múltiplo de 2, 3 y 4 para grids responsivos)

/**
 * Hook para cargar fotos con paginación infinita.
 *
 * @param {object} filters
 * @param {string} [filters.albumId]   — filtrar por álbum
 * @param {string[]} [filters.tags]    — filtrar por tags
 * @param {number} [filters.year]      — filtrar por año
 * @param {number} [filters.month]     — filtrar por mes
 * @param {string} [filters.search]    — buscar en descripción
 */
export function usePhotos(filters = {}) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  // Construye la query de Supabase con los filtros activos
  function buildQuery(rangeStart, rangeEnd) {
    let q = supabase
      .from('photos')
      .select('id, url, thumbnail_url, fecha, album_id, tags, descripcion, created_at')
      .order('fecha', { ascending: false })
      .range(rangeStart, rangeEnd)

    if (filters.albumId) {
      q = q.eq('album_id', filters.albumId)
    }
    if (filters.tags?.length) {
      // overlaps = la foto tiene AL MENOS UNO de esos tags
      q = q.overlaps('tags', filters.tags)
    }
    if (filters.year) {
      const start = `${filters.year}-01-01`
      const end   = `${filters.year}-12-31`
      q = q.gte('fecha', start).lte('fecha', end)
    }
    if (filters.month && filters.year) {
      const mm = String(filters.month).padStart(2, '0')
      const start = `${filters.year}-${mm}-01`
      // Último día del mes
      const lastDay = new Date(filters.year, filters.month, 0).getDate()
      const end = `${filters.year}-${mm}-${lastDay}`
      q = q.gte('fecha', start).lte('fecha', end)
    }
    if (filters.search) {
      q = q.ilike('descripcion', `%${filters.search}%`)
    }

    return q
  }

  // Carga inicial o cuando cambian los filtros
  const loadPhotos = useCallback(async () => {
    setLoading(true)
    setError(null)
    setPage(0)
    setHasMore(true)

    const { data, error: err } = await buildQuery(0, PAGE_SIZE - 1)

    if (err) {
      setError(err.message)
    } else {
      setPhotos(data || [])
      setHasMore((data?.length || 0) === PAGE_SIZE)
      setPage(1)
    }
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  // Carga más fotos (scroll infinito)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const start = page * PAGE_SIZE
    const end   = start + PAGE_SIZE - 1

    const { data, error: err } = await buildQuery(start, end)

    if (err) {
      setError(err.message)
    } else {
      setPhotos(prev => [...prev, ...(data || [])])
      setHasMore((data?.length || 0) === PAGE_SIZE)
      setPage(prev => prev + 1)
    }
    setLoadingMore(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasMore, loadingMore, JSON.stringify(filters)])

  return { photos, loading, loadingMore, error, hasMore, loadPhotos, loadMore }
}
