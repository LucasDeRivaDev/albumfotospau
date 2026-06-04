export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  return (
    <div
      className={`
        rounded-full animate-spin
        border-[var(--theme-border)]
        border-t-[var(--theme-accent)]
        ${sizes[size]}
        ${className}
      `}
      role="status"
      aria-label="Cargando"
    />
  )
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--theme-bg)]">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-[var(--theme-text-muted)] text-sm">Cargando...</p>
      </div>
    </div>
  )
}
