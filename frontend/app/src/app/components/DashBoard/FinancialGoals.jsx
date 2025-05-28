export default function FinancialGoals() {
  const metas = [
    { objetivo: 'Comprar um PC Gamer', progresso: 75 },
    { objetivo: 'Viajar para a Grécia', progresso: 50 },
    { objetivo: 'Quitar dívidas', progresso: 90 },
  ]

  return (
    <section className="bg-gray-950 text-white p-6 rounded-3xl shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex-1">
      <h3 className="text-lg font-bold mb-6 tracking-wide uppercase text-gray-300">Metas Financeiras</h3>

      {metas.map((meta, idx) => (
        <div key={idx} className="mb-4 group">
          <div className="flex justify-between text-sm mb-1 text-gray-400">
            <span>{meta.objetivo}</span>
            <span>{meta.progresso}%</span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className={`bg-gradient-to-r from-orange-500 to-orange-700 h-2 rounded-full group-hover:scale-x-105 transform transition-transform duration-300`}
              style={{ width: `${meta.progresso}%` }}
            />
          </div>
        </div>
      ))}
    </section>
  )
}
