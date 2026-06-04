// Emojis por tag reconocido
const TAG_EMOJIS = {
  princesa: '👑',
  princess: '👑',
  dinosaurio: '🦕',
  dino: '🦕',
  dinosaurios: '🦕',
  animal: '🐾',
  animales: '🐾',
  animals: '🐾',
  mascotas: '🐾',
  familia: '❤️',
  cumpleaños: '🎂',
  playa: '🏖️',
  viaje: '✈️',
  navidad: '🎄',
}

/**
 * Badge de tag con emoji automático si el tag es reconocido.
 */
export function TagBadge({ tag, onClick, active = false }) {
  const emoji = TAG_EMOJIS[tag.toLowerCase()] || ''

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
        transition-all duration-150 cursor-pointer
        ${active
          ? 'bg-[var(--theme-accent)] text-white'
          : 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-white'
        }
      `}
    >
      {emoji && <span>{emoji}</span>}
      {tag}
    </button>
  )
}
