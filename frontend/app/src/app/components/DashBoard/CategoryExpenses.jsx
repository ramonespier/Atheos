export default function CategoryExpenses() {
  const categorias = [
    { label: 'Moradia', valor: 'R$ 800,00', percent: 89, deus: 'Héstia', cor: 'from-red-500 to-red-700' },
    { label: 'Alimentação', valor: 'R$ 900,00', percent: 90, deus: 'Deméter', cor: 'from-green-500 to-green-700' },
    { label: 'Transporte', valor: 'R$ 320,00', percent: 91, deus: 'Hermes', cor: 'from-blue-500 to-blue-700' },
    { label: 'Lazer', valor: 'R$ 400,00', percent: 70, deus: 'Dionísio', cor: 'from-purple-500 to-purple-700' },
    { label: 'Educação', valor: 'R$ 250,00', percent: 60, deus: 'Atena', cor: 'from-yellow-500 to-yellow-700' }
  ]

  return (
    <section className="bg-gray-950 text-white p-6 rounded-3xl shadow-xl hover:shadow-orange-500/30 transition-all duration-300">
      <h3 className="text-lg font-bold mb-6 tracking-wide uppercase text-gray-300">Despesas por Categoria</h3>

      {categorias.map((cat, idx) => (
        <div key={idx} className="mb-4 group">
          <div className="flex justify-between text-xs mb-1 text-gray-400">
            <span>
              {cat.label} — <span className="italic text-gray-500">{cat.deus}</span>
            </span>
            <span>{cat.percent}%</span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${cat.cor} h-2 rounded-full group-hover:scale-x-105 transform transition-transform duration-300`}
              style={{ width: `${cat.percent}%` }}
            />
          </div>

          <div className="text-[10px] text-gray-500 mt-1">{cat.valor}</div>
        </div>
      ))}
    </section>
  )
}
