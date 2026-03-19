import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getThemeForIndex } from '../constants/themes'

const useFlashcardStore = create(
  persist(
    (set, get) => ({

      decks: [],

      addDeck(title, topic, rawCards) {
        const themeIndex = get().decks.length
        const newDeck = {
          id: crypto.randomUUID(),
          title,
          topic,
          createdAt: new Date().toISOString(),
          themeIndex,
          cards: rawCards.map((c) => ({
            id: crypto.randomUUID(),
            unit: c.unit,
            q: c.q,
            a: c.a,
          })),
        }
        set((s) => ({ decks: [...s.decks, newDeck] }))
        return newDeck
      },

      deleteDeck(deckId) {
        set((s) => ({ decks: s.decks.filter((d) => d.id !== deckId) }))
      },

      getDeckById: (deckId) => get().decks.find((d) => d.id === deckId) ?? null,

      getThemeForDeck: (deckId) => {
        const deck = get().getDeckById(deckId)
        return getThemeForIndex(deck?.themeIndex ?? 0)
      },

      view: 'home',
      activeDeckId: null,
      activeUnit: 'Todas',

      startSession: (deckId, unit = 'Todas') =>
        set({ view: 'session', activeDeckId: deckId, activeUnit: unit }),

      setActiveUnit: (unit) => set({ activeUnit: unit }),

      endSession: () =>
        set({ view: 'home', activeDeckId: null, activeUnit: 'Todas' }),
    }),
    {
      name: 'flashcards-storage',
      partialize: (s) => ({ decks: s.decks }),
    }
  )
)

export default useFlashcardStore
