const VARIANTS = {
  primary: 'bg-[var(--accent)] text-[#0f0f14] hover:opacity-90 font-semibold',
  ghost: 'bg-[var(--surface)] text-[var(--accent)] border border-[rgba(232,201,109,0.3)] hover:bg-[rgba(232,201,109,0.08)]',
  danger: 'bg-[rgba(232,112,112,0.15)] text-[var(--wrong)] border border-[rgba(232,112,112,0.3)] hover:bg-[rgba(232,112,112,0.25)]',
  success: 'bg-[rgba(94,232,160,0.15)] text-[var(--correct)] border border-[rgba(94,232,160,0.3)] hover:bg-[rgba(94,232,160,0.25)]',
  muted: 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--text)]',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-xl',
  md: 'px-5 py-3 text-sm rounded-[14px]',
  lg: 'px-6 py-3.5 text-[15px] rounded-[14px]',
}

export default function Button({
  children, variant = 'ghost', size = 'md',
  fullWidth = false, disabled = false, className = '', style, ...rest
}) {
  return (
    <button
      disabled={disabled}
      style={style}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-200 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANTS[variant], SIZES[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
