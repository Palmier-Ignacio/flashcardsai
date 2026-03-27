import { useState, useRef } from 'react'
import Button from '../ui/Button'

export default function AIPanel({ onGenerate, onImport, loading, error }) {
  const [mode, setMode] = useState('pdf')
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const isPDF = mode === 'pdf'
  const accept = isPDF ? 'application/pdf' : 'application/json'
  const canSubmit = !loading && file !== null && title.trim() !== ''

  const handleFile = (incoming) => {
    if (!incoming) return
    if (isPDF && incoming.type !== 'application/pdf') { alert('Solo se aceptan archivos PDF.'); return }
    if (!isPDF && !incoming.name.endsWith('.json')) { alert('Solo se aceptan archivos .json'); return }
    setFile(incoming)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleModeChange = (m) => { setMode(m); setFile(null); setTitle('') }

  const handleSubmit = () => {
    if (!canSubmit) return
    if (isPDF) {
      onGenerate(file, title.trim())
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          onImport(data, title.trim())
        } catch {
          alert('El archivo JSON no es válido o está corrupto.')
        }
      }
      reader.readAsText(file)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{isPDF ? '✨' : '📂'}</span>
        <div>
          <h2 className="font-serif font-bold text-lg text-[var(--text)]">
            {isPDF ? 'Generar desde PDF' : 'Importar Flashcards'}
          </h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {isPDF
              ? 'Subí tu apunte y la IA genera las preguntas automáticamente'
              : 'Cargá un mazo exportado previamente en formato JSON'}
          </p>
        </div>
      </div>

      {/* Toggle PDF / JSON */}
      <div className="flex gap-2 mb-5 p-1 bg-[var(--bg)] rounded-xl">
        {[
          { id: 'pdf', label: '✨ Generar con IA' },
          { id: 'json', label: '📥 Importar Flashcards (.json)' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleModeChange(id)}
            className={[
              'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
              mode === id
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-[10px] tracking-widest uppercase text-[var(--muted)] mb-2">
          Nombre del mazo <span className="text-[var(--wrong)]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Derecho Laboral - Cuadernillo Unidad 2"
          maxLength={60}
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl
                     px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)]
                     focus:outline-none focus:border-[#e8c96d] transition-colors"
        />
      </div>

      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          'relative rounded-xl border-2 border-dashed transition-all duration-200',
          'flex flex-col items-center justify-center text-center p-8 mb-5',
          file
            ? 'border-[#e8c96d] bg-[rgba(232,201,109,0.06)] cursor-default'
            : dragOver
              ? 'border-[#e8c96d] bg-[rgba(232,201,109,0.08)] cursor-copy scale-[1.01]'
              : 'border-[var(--border)] hover:border-[#e8c96d] hover:bg-[rgba(232,201,109,0.04)] cursor-pointer',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="w-full">
            <div className="flex items-center gap-3 bg-[var(--bg)] rounded-xl p-4 mb-3">
              <span className="text-3xl">{isPDF ? '📑' : '📋'}</span>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="text-[var(--muted)] hover:text-[var(--wrong)] transition-colors cursor-pointer text-lg leading-none"
              >✕</button>
            </div>
            <p className="text-xs text-[#e8c96d]">
              {isPDF ? '✓ PDF listo' : '✓ JSON listo'}
              {!title.trim() && <span className="text-[var(--muted)]"> · Completá el nombre del mazo para continuar</span>}
            </p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-3 opacity-40">{isPDF ? '📂' : '🗂'}</div>
            <p className="text-sm text-[var(--text)] mb-1">
              Arrastrá tu{isPDF ? ' PDF' : 's Flashcards'} acá o{' '}
              <span className="text-[#e8c96d]">hacé clic para elegir</span>
            </p>
            <p className="text-xs text-[var(--muted)]">
              {isPDF ? 'Solo archivos PDF - máximo 20 MB' : 'Archivos .json descargados desde esta página'}
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm
                        bg-[rgba(232,112,112,0.1)] border border-[rgba(232,112,112,0.3)]
                        text-[var(--wrong)]">
          ⚠️ {error}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!canSubmit}
        onClick={handleSubmit}
        style={{ background: canSubmit ? '#e8c96d' : undefined }}
      >
        {loading
          ? <><span className="spin">⟳</span> Analizando PDF…</>
          : isPDF ? <>✨ Generar flashcards</> : <>📥 Importar mazo</>
        }
      </Button>

      {loading && (
        <p className="text-center text-xs text-[var(--muted)] mt-3">
          Generando Flashcards, esto puede tardar unos segundos según el tamaño del documento…
        </p>
      )}
    </div>
  )
}
