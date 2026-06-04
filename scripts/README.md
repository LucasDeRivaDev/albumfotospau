# Script de carga de fotos

Este script procesa fotos desde tu computadora y las sube a R2 + Supabase.

## Instalación (una sola vez)

```bash
npm install --save-dev @aws-sdk/client-s3 sharp dotenv
```

> `sharp` procesa las imágenes localmente — convierte a WebP y genera thumbnails.

## Cómo usarlo

```bash
# Subir fotos de enero 2024 al álbum "abc123"
node scripts/upload.js --folder "C:/Fotos/Enero2024" --year 2024 --month 1 --album abc123

# Subir fotos sin asociar a un álbum específico
node scripts/upload.js --folder "C:/Fotos/Varias" --year 2024 --month 3
```

## Flujo interno

1. Lee cada foto de la carpeta
2. Convierte a WebP con sharp (más liviano, mejor calidad)
3. Genera thumbnail de 400px de ancho
4. Sube ambas versiones a R2:
   - `photos/2024/01/foto.webp` — versión completa
   - `thumbs/2024/01/foto.webp` — thumbnail
5. Inserta los metadatos en Supabase (url, thumbnail_url, fecha, album_id)

Si una foto ya existe (mismo filename), la saltea automáticamente.
