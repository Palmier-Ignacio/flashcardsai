import useFlashcardStore from '../../store/useFlashcardStore'
import { getThemeForIndex } from '../../constants/themes'
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

export default function DeckSelector() {
  const { decks, startSession, deleteDeck } = useFlashcardStore()

  if (decks.length === 0) return null

  return (
    <div className="mt-10">
      <h3 className="text-[10px] tracking-widest uppercase text-[var(--correct)] mb-4">
        Tus mazos guardados<br /><span className="text-[var(--muted)]">(se guardan por navegador/PC)</span>
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {decks.map((deck) => {
          const theme = getThemeForIndex(deck.themeIndex)
          const units = [...new Set(deck.cards.map((c) => c.unit))]
          const date = new Date(deck.createdAt).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',
          })

          return (
            <div
              key={deck.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 transition-all duration-200"
            >
              <div className="w-2.5 h-2.5 rounded-full mb-3" style={{ background: theme.accent }} />

              <h4 className="font-serif font-bold text-base leading-tight mb-1" style={{ color: theme.accent }}>
                {deck.title}
              </h4>

              <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">{deck.topic}</p>

              <div className="flex items-center gap-2 text-[11px] text-[var(--muted)] mb-4 flex-wrap">
                <span>{deck.cards.length} cards</span>
                <span>·</span>
                <span>{units.length} {units.length === 1 ? 'subtema' : 'subtemas'}</span>
                <span>·</span>
                <span>{date}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  style={{ background: theme.accent }}
                  onClick={() => startSession(deck.id)}
                >
                  Estudiar →
                </Button>

                <button
                  onClick={() => downloadDeckAsJSON(deck)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-[var(--bg)]
                             border border-[var(--border)] text-[var(--muted)]
                             hover:text-[#e8c96d] hover:border-[rgba(232,201,109,0.4)]
                             transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  ⬇ Descargar
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar el mazo "${deck.title}"?`))
                      deleteDeck(deck.id)
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs bg-[var(--bg)]
                             border border-[var(--border)] text-[var(--muted)]
                             hover:text-[var(--wrong)] hover:border-[rgba(232,112,112,0.4)]
                             transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  x Eliminar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
