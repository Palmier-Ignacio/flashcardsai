export default function ProgressBar({ pct = 0, label, sublabel, accent, accent2 }) {
  return (
    <div className="w-full">
      {(label || sublabel) && (
        <div className="flex justify-between text-xs text-[var(--muted)] mb-2">
          <span>{label}</span>
          <span>{sublabel}</span>
        </div>
      )}
      <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent2 ?? '#5ee8a0'}, ${accent ?? '#e8c96d'})`,
          }}
        />
      </div>
    </div>
  )
}
