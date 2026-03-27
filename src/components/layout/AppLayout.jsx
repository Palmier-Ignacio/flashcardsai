export default function AppLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        {children}
      </div>
      <footer className="text-center py-8 mt-4">
        <p className="text-[12px] text-[var(--muted)]">
          Hecho con ❤️ por{' '}
          <a
            href="https://palmier-ignacio.github.io/"   // <---- no me tengo que olvidar de poner mi url al portfolio en vez de linkedin :)
            target="_blank"
            rel="noreferrer"
            className="text-[#e8c96d] hover:underline transition-colors"
          >
            Palmier Ignacio
          </a>
        </p>
        <p className="text-[12px] text-[var(--muted)]">En ocasiones, puede que la IA alcance los limites del dia. (proyecto de prueba)</p>
        <p className="text-[12px] text-[var(--muted)]">Tener en cuenta que la IA puede cometer errores - Utilizar las flashcards solo para repaso o divertirse!</p>
        <p className="text-[12px] text-[var(--correct)]">Todo el apoyo para mejorar la página es bienvenido!</p>
      </footer>
    </div>
  )
}
