import { getNextApiKey, keyCount } from './keyRotator'

const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite-preview',
]

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = () => reject(new Error('No se pudo leer el archivo PDF.'))
    reader.readAsDataURL(file)
  })
}

export async function generateFlashcardsFromPDF(pdfFile) {
  if (!pdfFile || pdfFile.type !== 'application/pdf') {
    throw new Error('El archivo debe ser un PDF válido.')
  }

  const base64 = await fileToBase64(pdfFile)
  let lastError = null

  for (const model of MODELS) {
    for (let attempt = 0; attempt < keyCount || attempt < 1; attempt++) {
      const apiKey = getNextApiKey()
      try {
        return await callGemini(base64, apiKey, model)
      } catch (err) {
        lastError = err
        if (err.isRateLimit && attempt + 1 < keyCount) {
          console.warn(`[gemini] Key #${attempt + 1} + modelo ${model} con rate limit, probando siguiente key…`)
          continue
        }
        if (err.isRateLimit) {
          console.warn(`[gemini] Todas las keys agotadas en ${model}, pasando al siguiente modelo…`)
          break
        }
        throw err
      }
    }
  }

  throw lastError
}

async function callGemini(base64, apiKey, model) {
  const response = await fetch(
    `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequestBody(base64)),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = err?.error?.message ?? `Error HTTP ${response.status}`

    const isRateLimit = response.status === 429 ||
      msg.toLowerCase().includes('quota') ||
      msg.toLowerCase().includes('rate')

    if (isRateLimit) {
      const retryMatch = msg.match(/retry in ([\d.]+)s/i)
      const retryIn = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null
      const retryMsg = retryIn
        ? `Cuota de la API superada. Reintentá en ${retryIn} segundos.`
        : 'Cuota de la API superada. Esperá unos segundos y volvé a intentarlo.'
      const error = new Error(retryMsg)
      error.isRateLimit = true
      throw error
    }

    throw new Error(msg)
  }

  const data = await response.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return parseResponse(rawText)
}

function buildRequestBody(base64) {
  return {
    contents: [{
      parts: [
        { inline_data: { mime_type: 'application/pdf', data: base64 } },
        { text: buildPrompt() },
      ],
    }],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 16000,
    },
  }
}

function buildPrompt() {
  return `Analizá en profundidad el documento PDF adjunto y generá una cantidad apropiada de flashcards de estudio que cubran todos los conceptos importantes del material.

Instrucciones:
- Analizá la extensión y densidad del contenido para determinar la cantidad de flashcards:
  * 1 a 5 páginas   → entre 5 y 15 cards
  * 6 a 20 páginas  → entre 15 y 35 cards
  * 21 a 50 páginas → entre 35 y 60 cards
  * más de 50 páginas → entre 60 y 100 cards
- Cada tema o concepto importante debe tener al menos una card. No omitás temas por reducir cantidad.
- Las preguntas deben evaluar comprensión real, no solo memorización superficial.
- Las respuestas deben ser completas pero concisas (máximo 4 oraciones).
- Usá etiquetas HTML básicas tanto en las preguntas como en las respuestas: <strong> para conceptos clave, <em> para términos técnicos.
- Agrupá las cards por subtema usando el campo "unit" (máximo 3 palabras).
- Variá el tipo de pregunta: definiciones, diferencias, artículos o normas, consecuencias, ejemplos prácticos.
- No repitas conceptos; cada card debe aportar algo único.
- No dejes pocas preguntas, pero tampoco muchas, se acorde al material.
- El contenido de la pregunta y la respuesta tiene que estar basado en el documento, no te salgas de lo mencionado, ni inventes o rellenes.

Respondé ÚNICAMENTE con un array JSON válido. Sin markdown, sin backticks, sin texto adicional.

Formato exacto:
[
  {
    "unit": "Nombre del subtema",
    "q": "Pregunta clara y específica",
    "a": "Respuesta con <strong>conceptos clave</strong> destacados"
  }
]`
}

function parseResponse(rawText) {
  console.log(rawText);
  const clean = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  let parsed
  try {
    parsed = JSON.parse(clean)
  } catch {
    const match = clean.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('La IA no devolvió un JSON válido. Intentá de nuevo.')
    parsed = JSON.parse(match[0])
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('La IA no pudo generar flashcards a partir de este PDF.')
  }

  return parsed.map((card, i) => ({
    unit: String(card.unit || 'General').trim(),
    q: String(card.q || `Pregunta ${i + 1}`).trim(),
    a: String(card.a || '').trim(),
  }))
}