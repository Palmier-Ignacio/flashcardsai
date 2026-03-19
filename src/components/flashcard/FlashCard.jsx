export default function FlashCard({ card, flipped, current, total, theme, onFlip }) {
  if (!card) return null

  return (
    <div
      className="card-scene h-[340px] mb-6 cursor-pointer active:scale-[0.99] transition-transform"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label={flipped ? 'Ver pregunta' : 'Ver respuesta'}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onFlip()}
    >
      <div className={`card-inner h-full${flipped ? ' flipped' : ''}`}>

        <div className="card-face front">
          <span
            className="absolute top-4 left-5 text-[10px] tracking-widest uppercase opacity-70"
            style={{ color: theme.accent }}
          >
            {card.unit}
          </span>

          <span className="absolute top-4 right-5 text-[11px] text-[var(--muted)] bg-white/5 px-2.5 py-1 rounded-full">
            {current + 1}/{total}
          </span>

          <p
            className="font-serif text-[var(--text)]"
            style={{ fontSize: 'clamp(15px, 2.8vw, 21px)', lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: card.q }}
          />

          <span className="absolute bottom-4 right-5 text-[11px] text-[var(--muted)]">
            clic para ver →
          </span>
        </div>

        <div className="card-face back" style={{ background: theme.cardBack }}>
          <span
            className="absolute top-4 left-5 text-[10px] tracking-widest uppercase opacity-70"
            style={{ color: theme.accent2 }}
          >
            Respuesta
          </span>

          <div
            className="answer-content"
            style={{ '--strong-color': theme.accent2 }}
            dangerouslySetInnerHTML={{ __html: card.a }}
          />
        </div>

      </div>
    </div>
  )
}
