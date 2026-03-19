import { useEffect } from 'react'

export function useKeyboardShortcuts({ onFlip, onCorrect, onWrong, flipped }, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault(); onFlip?.(); break
        case 'ArrowRight':
        case 'l': case 'L':
          if (!flipped) return          
          e.preventDefault(); onCorrect?.(); break
        case 'ArrowLeft':
        case 'j': case 'J':
          if (!flipped) return         
          e.preventDefault(); onWrong?.(); break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled, flipped, onFlip, onCorrect, onWrong])
}
