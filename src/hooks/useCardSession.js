import { useState, useCallback, useMemo, useEffect, useRef } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useCardSession(cards) {
  const [deck, setDeck] = useState(() => shuffle(cards))
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [wrongCards, setWrongCards] = useState([])
  const [finished, setFinished] = useState(false)

  const cardsRef = useRef(cards)
  cardsRef.current = cards

  const prevCardsRef = useRef(cards)
  useEffect(() => {
    if (prevCardsRef.current !== cards) {
      prevCardsRef.current = cards
      setDeck(shuffle(cards))
      setIdx(0)
      setFlipped(false)
      setCorrect(0)
      setWrong(0)
      setWrongCards([])
      setFinished(false)
    }
  }, [cards])

  const currentCard = deck[idx] ?? null

  const progress = useMemo(() => ({
    current: idx,
    total: deck.length,
    pct: deck.length === 0 ? 0 : Math.round((idx / deck.length) * 100),
    remaining: deck.length - idx,
    correct,
    wrong,
  }), [idx, deck.length, correct, wrong])

  const flipCard = useCallback(() => setFlipped((f) => !f), [])

  const mark = useCallback((isCorrect) => {
    if (!flipped) { setFlipped(true); return }
    if (isCorrect) setCorrect((c) => c + 1)
    else { setWrong((w) => w + 1); setWrongCards((wc) => [...wc, deck[idx]]) }
    if (idx + 1 >= deck.length) setFinished(true)
    else { setIdx((i) => i + 1); setFlipped(false) }
  }, [flipped, deck, idx])

  const reset = useCallback(() => {
    setDeck(shuffle(cardsRef.current))
    setIdx(0); setFlipped(false)
    setCorrect(0); setWrong(0)
    setWrongCards([]); setFinished(false)
  }, [])

  const repeatWrong = useCallback(() => {
    if (!wrongCards.length) return
    setDeck(shuffle(wrongCards))
    setIdx(0); setFlipped(false)
    setCorrect(0); setWrong(0)
    setWrongCards([]); setFinished(false)
  }, [wrongCards])

  return { currentCard, progress, flipped, finished, wrongCards, flipCard, mark, reset, repeatWrong }
}
