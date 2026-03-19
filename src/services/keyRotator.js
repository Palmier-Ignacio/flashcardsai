const KEYS = [
  import.meta.env.VITE_GEMINI_KEY_1,
  import.meta.env.VITE_GEMINI_KEY_2,
  import.meta.env.VITE_GEMINI_KEY_3,
  import.meta.env.VITE_GEMINI_KEY_4,
  import.meta.env.VITE_GEMINI_KEY_5,
].filter((k) => typeof k === 'string' && k.trim() !== '' && k !== 'undefined')

if (KEYS.length === 0) {
  console.error(
    '[keyRotator] No se encontró ninguna VITE_GEMINI_KEY_* válida.\n' +
    'Verificá:\n' +
    '  1. Que el archivo se llame .env (no .env.example)\n' +
    '  2. Que la variable NO esté comentada (sin # al inicio)\n' +
    '  3. Que hayas reiniciado npm run dev después de editar el .env'
  )
}

let currentIndex = 0

/**
 * Devolvemos la próxima API key disponible (round-robin).
 * @returns {string}
 */
export function getNextApiKey() {
  if (KEYS.length === 0) {
    throw new Error(
      'No hay API keys configuradas. ' +
      'Revisá que el archivo .env existe en la raíz del proyecto con VITE_GEMINI_KEY_1=tu_key y reiniciá npm run dev.'
    )
  }
  const key = KEYS[currentIndex]
  currentIndex = (currentIndex + 1) % KEYS.length
  return key
}

export const keyCount = KEYS.length
