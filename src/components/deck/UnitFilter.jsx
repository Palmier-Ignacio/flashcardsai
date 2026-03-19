import useFlashcardStore from '../../store/useFlashcardStore'

/**
 * UnitFilter
 * @param {string[]} units       
 * @param {string}   accent      
 * @param {Function} onUnitChange 
 */
export default function UnitFilter({ units, accent, onUnitChange }) {
  const { activeUnit, setActiveUnit } = useFlashcardStore()
  const tabs = ['Todas', ...units]

  const handleClick = (unit) => {
    setActiveUnit(unit)
    onUnitChange?.(unit) 
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tabs.map((unit) => {
        const isActive = activeUnit === unit
        return (
          <button
            key={unit}
            onClick={() => handleClick(unit)}
            className={[
              'px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer',
              isActive
                ? 'text-[#0f0f14] font-semibold'
                : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]',
            ].join(' ')}
            style={isActive ? { background: accent, borderColor: accent } : {}}
          >
            {unit}
          </button>
        )
      })}
    </div>
  )
}
