// R2 no tiene SDK del lado del cliente — las fotos se sirven via URL pública.
// Este archivo provee helpers para construir esas URLs.

const R2_BASE = import.meta.env.VITE_R2_PUBLIC_URL

if (!R2_BASE) {
  throw new Error('Falta VITE_R2_PUBLIC_URL en el archivo .env')
}

/**
 * Construye la URL pública de una foto original en R2.
 * @param {string} key — ej: "photos/2024/01/foto.webp"
 */
export function getPhotoUrl(key) {
  if (!key) return null
  // Si la key ya es una URL completa, la devolvemos tal cual
  if (key.startsWith('http')) return key
  return `${R2_BASE}/${key}`
}

/**
 * Construye la URL pública del thumbnail en R2.
 * @param {string} key — ej: "thumbs/2024/01/foto.webp"
 */
export function getThumbUrl(key) {
  if (!key) return null
  if (key.startsWith('http')) return key
  return `${R2_BASE}/${key}`
}

/**
 * Genera la key de R2 para una foto dado año, mes y nombre de archivo.
 * @param {number} year
 * @param {number} month — 1 a 12
 * @param {string} filename
 */
export function buildPhotoKey(year, month, filename) {
  const mm = String(month).padStart(2, '0')
  return `photos/${year}/${mm}/${filename}`
}

/**
 * Genera la key del thumbnail dado año, mes y nombre de archivo.
 */
export function buildThumbKey(year, month, filename) {
  const mm = String(month).padStart(2, '0')
  return `thumbs/${year}/${mm}/${filename}`
}
