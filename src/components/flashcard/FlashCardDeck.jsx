import { useMemo, useCallback } from 'react'
import useFlashcardStore from '../../store/useFlashcardStore'
import { useCardSession } from '../../hooks/useCardSession'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import FlashCard from './FlashCard'
import FinishedScreen from './FinishedScreen'
import UnitFilter from '../deck/UnitFilter'
import ProgressBar from '../ui/ProgressBar'
import Button from '../ui/Button'

function downloadDeckAsJSON(deck) {
  const payload = {
    title: deck.title,
    topic: deck.topic,
    createdAt: deck.createdAt,
    cards: deck.cards.map(({ unit, q, a }) => ({ unit, q, a })),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${deck.title.replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export default function FlashCardDeck({ deck, theme }) {
  const { activeUnit, setActiveUnit, endSession } = useFlashcardStore()

  const filteredCards = useMemo(() => (
    activeUnit === 'Todas'
      ? deck.cards
      : deck.cards.filter((c) => c.unit === activeUnit)
  ), [deck.cards, activeUnit])

  const session = useCardSession(filteredCards)

  const handleUnitChange = useCallback((unit) => {
    setActiveUnit(unit)
    session.reset()
  }, [setActiveUnit, session.reset])

  useKeyboardShortcuts(
    {
      onFlip: session.flipCard,
      onCorrect: () => session.mark(true),
      onWrong: () => session.mark(false),
      flipped: session.flipped,
    },
    !session.finished
  )

  const units = useMemo(
    () => [...new Set(deck.cards.map((c) => c.unit))],
    [deck.cards]
  )

  return (
    <div className="fade-in">

      <div className="flex items-center justify-between py-6 mb-2">
        <button
          onClick={endSession}
          className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          ← Volver
        </button>

        <div className="text-center">
          <div
            className="text-[10px] tracking-widest uppercase mb-0.5"
            style={{ color: theme.accent }}
          >
            Estudiando
          </div>
          <h1 className="font-serif font-bold text-lg text-[var(--text)]">
            {deck.title}
          </h1>
        </div>

        <button
          onClick={() => downloadDeckAsJSON(deck)}
          title="Descargar flashcards como JSON"
          className="text-sm text-[var(--muted)] hover:text-[#e8c96d] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          ⬇ Descargar
        </button>
      </div>

      {units.length > 1 && (
        <div className="mb-6">
          <UnitFilter units={units} accent={theme.accent} onUnitChange={handleUnitChange} />
        </div>
      )}

      {!session.finished && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Restantes', val: session.progress.remaining, color: theme.accent },
            { label: 'Correctas', val: session.progress.correct, color: 'var(--correct)' },
            { label: 'A repasar', val: session.progress.wrong, color: 'var(--wrong)' },
          ].map(({ label, val, color }) => (
            <div key={label}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3 px-4 text-center"
            >
              <div className="text-xl font-bold font-serif" style={{ color }}>{val}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {!session.finished && (
        <div className="mb-5">
          <ProgressBar
            pct={session.progress.pct}
            label={`Tarjeta ${Math.min(session.progress.current + 1, session.progress.total)} de ${session.progress.total}`}
            sublabel={`${session.progress.pct}%`}
            accent={theme.accent}
            accent2={theme.accent2}
          />
        </div>
      )}

      {filteredCards.length === 0 && (
        <div className="text-center py-20 text-[var(--muted)] text-sm">
          No hay flashcards en esta unidad.
        </div>
      )}

      {session.finished && filteredCards.length > 0 && (
        <FinishedScreen
          correct={session.progress.correct}
          wrong={session.progress.wrong}
          wrongCards={session.wrongCards}
          theme={theme}
          onReset={session.reset}
          onRepeatWrong={session.repeatWrong}
          onBack={endSession}
        />
      )}

      {!session.finished && session.currentCard && (
        <>
          <FlashCard
            card={session.currentCard}
            flipped={session.flipped}
            current={session.progress.current}
            total={session.progress.total}
            theme={theme}
            onFlip={session.flipCard}
          />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button
              variant="danger"
              size="lg"
              fullWidth
              disabled={!session.flipped}
              onClick={() => session.mark(false)}
              title={!session.flipped ? 'Primero mirá la respuesta' : ''}
            >
              ✗ A repasar
            </Button>
            <Button
              variant="success"
              size="lg"
              fullWidth
              disabled={!session.flipped}
              onClick={() => session.mark(true)}
              title={!session.flipped ? 'Primero mirá la respuesta' : ''}
            >
              ✓ La sabía
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <Button variant="ghost" fullWidth onClick={session.flipCard}>
              {session.flipped ? 'Ver pregunta' : 'Ver respuesta'}
            </Button>
            <Button variant="muted" fullWidth onClick={session.reset}>
              Reiniciar
            </Button>
          </div>
          <p className="text-center text-[11px] text-[var(--muted)] tracking-widest uppercase">
            TECLAS (CONTROLES)
          </p>

          <p className="text-center text-[11px] text-[var(--muted)] tracking-widest uppercase">
            {session.flipped
              ? 'Espacio o Enter = voltear | ← a repasar | → la sabía'
              : 'Espacio o Enter para ver la respuesta'}
          </p>
        </>
      )}

    </div>
  )
}
