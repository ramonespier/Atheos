'use client'

export default function Depoimentos() {
  const feedbacks = [
    {
      nome: 'Hércules Financeiro',
      texto: 'Com Atheos, dominei minhas finanças como um verdadeiro semideus!'
    },
    {
      nome: 'Afrodite Investidora',
      texto: 'Nunca me senti tão confiante com meus investimentos! Atheos é divino!'
    },
    {
      nome: 'Poseidon Economista',
      texto: 'Controle absoluto das finanças, como controlo os mares!'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-neutral-100 flex flex-col items-center gap-16 px-6 md:px-24 select-none">
      <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(255,223,71,0.8)]">
        Depoimentos Divinos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl w-full">
        {feedbacks.map(({ nome, texto }, i) => (
          <article
            key={i}
            tabIndex={0}
            aria-label={`Depoimento de ${nome}`}
            className="bg-neutral-800 bg-opacity-90 p-10 rounded-3xl flex flex-col items-center text-center shadow-[0_8px_30px_rgba(255,195,18,0.3)] hover:shadow-[0_12px_40px_rgba(255,223,71,0.7)] transition-shadow duration-400 ease-in-out cursor-default transform hover:scale-105"
          >
            <div
              className="w-20 h-20 mb-7 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-extrabold text-2xl shadow-lg"
              aria-hidden="true"
            >
              {nome
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()}
            </div>
            <h3 className="text-2xl font-semibold text-yellow-300 mb-4 drop-shadow-md">{nome}</h3>
            <p className="text-neutral-300 leading-relaxed text-base md:text-lg max-w-[260px] md:max-w-sm">
              {texto}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
