const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

/**
 * Formatea una fecha ISO a "15 de Marzo de 2024"
 */
export function formatFecha(fechaIso) {
  if (!fechaIso) return ''
  // Parseamos manualmente para evitar problemas de timezone
  const [year, month, day] = fechaIso.split('T')[0].split('-').map(Number)
  return `${day} de ${MESES[month - 1]} de ${year}`
}

/**
 * Devuelve "Marzo 2024"
 */
export function formatMesAnio(year, month) {
  if (!year || !month) return ''
  return `${MESES[month - 1]} ${year}`
}

/**
 * Devuelve el nombre del mes (1-12)
 */
export function nombreMes(month) {
  return MESES[month - 1] || ''
}
