const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000'

export async function generateFlashcardsFromPDF(file) {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('El archivo debe ser un PDF válido.')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${BACKEND_URL}/api/flashcards/generate`, {
    method: 'POST',
    body:   formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.message ?? `Error HTTP ${response.status}`)
  }

  const data = await response.json()
  return data.cards
}