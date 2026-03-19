import Button from '../ui/Button'

export default function FinishedScreen({ correct, wrong, wrongCards, theme, onReset, onRepeatWrong, onBack }) {
  const total = correct + wrong
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100)

  const message =
    pct === 100 ? '¡Perfecto! Dominás todo el mazo.' :
      pct >= 80 ? `Muy bien: ${correct} de ${total} correctas. Repasá las ${wrong} que fallaste.` :
        pct >= 50 ? `${correct} de ${total} correctas. Vas bien, ¡seguí repasando!` :
          `${correct} de ${total} correctas. Algo flojo :( ¡Dale otra vuelta al mazo!`

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center fade-in mb-6">

      <div
        className="text-6xl font-black font-serif mb-2"
        style={{
          background: `linear-gradient(135deg, var(--correct), ${theme.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {pct}%
      </div>

      <h2 className="font-serif text-2xl mb-2" style={{ color: theme.accent }}>
        ¡Completaste el mazo!
      </h2>
      <p className="text-sm text-[var(--muted)] mb-8">{message}</p>

      <div className="flex justify-center gap-8 mb-8">
        <div>
          <div className="text-2xl font-bold font-serif text-[var(--correct)]">{correct}</div>
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-widest mt-0.5">Correctas</div>
        </div>
        <div>
          <div className="text-2xl font-bold font-serif text-[var(--wrong)]">{wrong}</div>
          <div className="text-[11px] text-[var(--muted)] uppercase tracking-widest mt-0.5">A repasar</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="ghost" onClick={onReset}>🔄 Reiniciar mazo</Button>

        {wrongCards.length > 0 && (
          <Button variant="danger" onClick={onRepeatWrong}>
            ⚡ Repasar {wrongCards.length} falladas
          </Button>
        )}

        <Button variant="muted" onClick={onBack}>← Volver a inicio</Button>
      </div>
    </div>
  )
}
