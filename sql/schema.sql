-- ═══════════════════════════════════════════════════════════════
-- SCHEMA — AlbumPau
-- Ejecutar en: Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════

-- ─── TABLA: albums ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS albums (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  cover_url   TEXT,    -- Key de R2 del cover (ej: "thumbs/2024/01/cover.webp")
  year        INT,
  month       INT CHECK (month BETWEEN 1 AND 12),
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: photos ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS photos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url             TEXT NOT NULL,           -- Key en R2: "photos/2024/01/foto.webp"
  thumbnail_url   TEXT NOT NULL,           -- Key en R2: "thumbs/2024/01/foto.webp"
  fecha           DATE,                    -- Fecha de la foto (no de la subida)
  album_id        UUID REFERENCES albums(id) ON DELETE SET NULL,
  tags            TEXT[] DEFAULT '{}',
  descripcion     TEXT,
  filename        TEXT,                    -- Nombre original del archivo
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ÍNDICES para búsquedas rápidas ──────────────────────────
CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_photos_fecha     ON photos(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_photos_tags      ON photos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_albums_year      ON albums(year DESC, month DESC);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
-- Solo usuarios autenticados pueden VER los datos.
-- Nadie puede insertar/actualizar/eliminar desde el frontend.
-- (La carga de fotos se hace solo desde el script local con service_key)

ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Borrar policies anteriores si existen (para poder re-ejecutar)
DROP POLICY IF EXISTS "Solo usuarios autenticados pueden ver albums" ON albums;
DROP POLICY IF EXISTS "Solo usuarios autenticados pueden ver photos" ON photos;

CREATE POLICY "Solo usuarios autenticados pueden ver albums"
  ON albums FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo usuarios autenticados pueden ver photos"
  ON photos FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── DATOS DE PRUEBA (opcional, para testear sin fotos reales) ─
-- Descomentá esto para insertar un álbum y foto de prueba

/*
INSERT INTO albums (nombre, descripcion, year, month, tags) VALUES
  ('Primer álbum', 'Para probar que todo funciona', 2024, 1, ARRAY['familia']),
  ('Cumpleaños 2024', 'El cumple de Pau', 2024, 6, ARRAY['princesa', 'cumpleaños']),
  ('Dinos y amigos', 'Fotos del zoológico', 2024, 8, ARRAY['dinosaurio', 'animales']);
*/
