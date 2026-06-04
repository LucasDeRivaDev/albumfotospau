/**
 * SCRIPT DE CARGA DE FOTOS — AlbumPau
 *
 * Este script procesa fotos desde una carpeta local y:
 *   1. Convierte cada imagen a WebP optimizado
 *   2. Genera un thumbnail 400px
 *   3. Sube ambas versiones a Cloudflare R2
 *   4. Inserta los metadatos en Supabase
 *
 * USO:
 *   node scripts/upload.js --folder ./mis-fotos --album <ALBUM_ID> --year 2024 --month 6
 *
 * INSTALAR dependencias del script (solo una vez):
 *   npm install --save-dev @aws-sdk/client-s3 sharp @supabase/supabase-js dotenv
 *
 * IMPORTANTE: Copiá .env.example como .env y completá las variables R2 y SUPABASE_SERVICE_KEY
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'fs/promises'
import { join, extname, basename } from 'path'
import { parseArgs } from 'util'
import 'dotenv/config'

// ─── Configuración ────────────────────────────────────────────
const THUMB_WIDTH  = 400   // px de ancho del thumbnail
const FULL_QUALITY = 82    // calidad WebP de la foto completa (0-100)
const THUMB_QUALITY = 75   // calidad WebP del thumbnail
const EXTENSIONS   = ['.jpg', '.jpeg', '.png', '.heic', '.webp', '.tiff']

// ─── Clientes ─────────────────────────────────────────────────
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // service_role key — tiene permisos de escritura
)

// ─── Helpers ──────────────────────────────────────────────────

/** Sube un buffer a R2 */
async function uploadToR2(key, buffer, contentType = 'image/webp') {
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }))
}

/** Verifica si una key ya existe en R2 (para no subir dos veces) */
async function existsInR2(key) {
  try {
    await r2.send(new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }))
    return true
  } catch {
    return false
  }
}

/** Verifica si una foto ya está en Supabase por filename */
async function existsInSupabase(filename) {
  const { data } = await supabase
    .from('photos')
    .select('id')
    .eq('filename', filename)
    .single()
  return !!data
}

/** Procesa y sube una sola foto */
async function processPhoto(filePath, albumId, year, month) {
  const filename = basename(filePath)
  const nameNoExt = basename(filePath, extname(filePath))
  const webpName = `${nameNoExt}.webp`

  const mm = String(month).padStart(2, '0')
  const photoKey = `photos/${year}/${mm}/${webpName}`
  const thumbKey = `thumbs/${year}/${mm}/${webpName}`

  // Si ya existe en Supabase, salteamos
  if (await existsInSupabase(filename)) {
    console.log(`  ↷ Salteando (ya existe): ${filename}`)
    return
  }

  // Leer el archivo original
  const originalBuffer = await readFile(filePath)

  // Procesar con sharp
  const image = sharp(originalBuffer).rotate() // .rotate() respeta el EXIF de orientación

  // Obtener metadatos (fecha EXIF si existe)
  const metadata = await image.metadata()

  // 1. Foto completa en WebP
  const fullBuffer = await image
    .clone()
    .webp({ quality: FULL_QUALITY })
    .toBuffer()

  // 2. Thumbnail en WebP
  const thumbBuffer = await image
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY })
    .toBuffer()

  // Subir a R2 (en paralelo)
  await Promise.all([
    uploadToR2(photoKey, fullBuffer),
    uploadToR2(thumbKey, thumbBuffer),
  ])

  // Insertar metadatos en Supabase
  const fecha = `${year}-${mm}-01`  // Fecha aproximada — se puede mejorar con EXIF

  const { error } = await supabase.from('photos').insert({
    url:           photoKey,
    thumbnail_url: thumbKey,
    fecha,
    album_id:      albumId || null,
    filename,
    tags:          [],
    descripcion:   null,
  })

  if (error) {
    throw new Error(`Error en Supabase: ${error.message}`)
  }

  console.log(`  ✓ ${filename} → ${photoKey}`)
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  const { values } = parseArgs({
    options: {
      folder:  { type: 'string', short: 'f' },
      album:   { type: 'string', short: 'a' },
      year:    { type: 'string', short: 'y' },
      month:   { type: 'string', short: 'm' },
    },
  })

  if (!values.folder || !values.year || !values.month) {
    console.error('Uso: node scripts/upload.js --folder <carpeta> --year <año> --month <mes> [--album <album_id>]')
    process.exit(1)
  }

  const folder  = values.folder
  const albumId = values.album || null
  const year    = parseInt(values.year)
  const month   = parseInt(values.month)

  console.log(`\nProcesando carpeta: ${folder}`)
  console.log(`Año: ${year}, Mes: ${month}, Álbum: ${albumId || 'ninguno'}\n`)

  // Leer archivos de la carpeta
  const allFiles = await readdir(folder)
  const photos = allFiles.filter(f =>
    EXTENSIONS.includes(extname(f).toLowerCase())
  )

  console.log(`Encontradas: ${photos.length} fotos\n`)

  let ok = 0
  let errors = 0

  for (const file of photos) {
    try {
      await processPhoto(join(folder, file), albumId, year, month)
      ok++
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`)
      errors++
    }
  }

  console.log(`\n─────────────────────────`)
  console.log(`✓ Subidas: ${ok}`)
  if (errors) console.log(`✗ Errores: ${errors}`)
  console.log(`─────────────────────────\n`)
}

main().catch(err => {
  console.error('Error fatal:', err.message)
  process.exit(1)
})
