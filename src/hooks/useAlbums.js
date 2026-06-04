import { useState, useEffect } from 'react'
import { supabase } from '../api/supabase'

/**
 * Carga todos los álbumes, ordenados por año y mes descendente.
 */
export function useAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAlbums() {
      const { data, error: err } = await supabase
        .from('albums')
        .select('id, nombre, descripcion, cover_url, year, month, tags, created_at')
        .order('year', { ascending: false })
        .order('month', { ascending: false })

      if (err) {
        setError(err.message)
      } else {
        setAlbums(data || [])
      }
      setLoading(false)
    }

    fetchAlbums()
  }, [])

  return { albums, loading, error }
}

/**
 * Carga un álbum por su ID.
 */
export function useAlbum(albumId) {
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!albumId) return

    async function fetchAlbum() {
      const { data, error: err } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .single()

      if (err) setError(err.message)
      else setAlbum(data)
      setLoading(false)
    }

    fetchAlbum()
  }, [albumId])

  return { album, loading, error }
}
