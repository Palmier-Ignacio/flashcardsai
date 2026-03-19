import { useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import AIPanel from './components/ai/AIPanel'
import DeckSelector from './components/deck/DeckSelector'
import FlashCardDeck from './components/flashcard/FlashCardDeck'
import useFlashcardStore from './store/useFlashcardStore'
import { generateFlashcardsFromPDF } from './services/geminiService'

function friendlyError(err) {
  const raw = err?.message ?? ''

  console.error('[Flashcards App] Error de API:', raw)

  if (err?.isRateLimit) {
    const match = raw.match(/(\d+)\s*segundo/i) || raw.match(/retry in ([\d.]+)s/i)
    const secs = match ? Math.ceil(parseFloat(match[1])) : null
    return secs
      ? `Límite de uso alcanzado. Volvé a intentarlo en ${secs} segundos.`
      : 'Límite de uso alcanzado. Esperá unos segundos e intentá de nuevo.'
  }

  if (raw.toLowerCase().includes('quota') || raw.toLowerCase().includes('rate')) {
    return 'Límite de uso alcanzado. Esperá unos segundos e intentá de nuevo.'
  }

  if (raw.toLowerCase().includes('api key') || raw.toLowerCase().includes('api_key')) {
    return 'Error de configuración. Contactá al administrador.'
  }

  if (raw.toLowerCase().includes('not found') || raw.toLowerCase().includes('404')) {
    return 'Error al conectar con el servicio de IA. Intentá de nuevo.'
  }

  if (raw.toLowerCase().includes('network') || raw.toLowerCase().includes('fetch')) {
    return 'Sin conexión a internet. Revisá tu red e intentá de nuevo.'
  }

  if (raw.toLowerCase().includes('json') || raw.toLowerCase().includes('parse')) {
    return 'La IA no pudo generar las flashcards correctamente. Intentá con otro PDF.'
  }

  return 'Ocurrió un error al procesar el documento. Intentá de nuevo.'
}

export default function App() {
  const { view, activeDeckId, getDeckById, getThemeForDeck, addDeck, startSession } =
    useFlashcardStore()

  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const handleGenerate = async (pdfFile, title) => {
    setAiError('')
    setAiLoading(true)
    try {
      const cards = await generateFlashcardsFromPDF(pdfFile)
      const newDeck = addDeck(title, pdfFile.name, cards)
      startSession(newDeck.id)
    } catch (err) {
      setAiError(friendlyError(err))
    } finally {
      setAiLoading(false)
    }
  }

  const handleImport = (data, title) => {
    setAiError('')
    try {
      if (!Array.isArray(data.cards) || data.cards.length === 0)
        throw new Error('El JSON no contiene cards válidas.')
      if (!data.cards.every((c) => c.q && c.a))
        throw new Error('Algunas cards del JSON no tienen pregunta o respuesta.')

      const topic = data.topic || title
      const newDeck = addDeck(title, topic, data.cards)
      startSession(newDeck.id)
    } catch (err) {
      setAiError(err.message ?? 'Error al importar el JSON.')
    }
  }

  const activeDeck = activeDeckId ? getDeckById(activeDeckId) : null
  const activeTheme = activeDeckId ? getThemeForDeck(activeDeckId) : null

  return (
    <AppLayout>

      {view === 'session' && activeDeck && activeTheme && (
        <FlashCardDeck deck={activeDeck} theme={activeTheme} />
      )}

      {view === 'home' && (
        <>
          <header className="text-center pt-10 pb-8">
            <p className="text-[11px] tracking-[3px] uppercase text-[#e8c96d] mb-3">
              Página para Material de estudio
            </p>
            <h1
              className="font-serif font-black leading-tight"
              style={{
                fontSize: 'clamp(28px, 6vw, 44px)',
                background: 'linear-gradient(135deg, var(--text) 40%, #e8c96d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FlashcardsAI
            </h1>
            <p className="text-sm text-[var(--muted)] mt-3 max-w-sm mx-auto">
              Subí cualquier PDF y la IA genera un mazo de estudio personalizado al instante.
            </p>
          </header>

          <AIPanel
            onGenerate={handleGenerate}
            onImport={handleImport}
            loading={aiLoading}
            error={aiError}
          />

          <DeckSelector />
        </>
      )}

    </AppLayout>
  )
}
