export default function CategoryExpenses() {
  const categorias = [
    { label: 'Moradia', valor: 'R$ 800,00', percent: 89, deus: 'Héstia', cor: 'bg-red-500' },
    { label: 'Alimentação', valor: 'R$ 900,00', percent: 90, deus: 'Deméter', cor: 'bg-green-500' },
    { label: 'Transporte', valor: 'R$ 320,00', percent: 91, deus: 'Hermes', cor: 'bg-blue-500' },
    { label: 'Lazer', valor: 'R$ 400,00', percent: 70, deus: 'Dionísio', cor: 'bg-purple-500' },
    { label: 'Educação', valor: 'R$ 250,00', percent: 60, deus: 'Atena', cor: 'bg-yellow-500' }
  ]

  return (
    <section className="bg-[#1C1B18] text-white p-4 rounded-lg shadow-md">
      <h3 className="text-base font-semibold mb-4">Despesas por Categoria</h3>

      {categorias.map((cat, idx) => (
        <div key={idx} className="mb-3 group">
          <div className="flex justify-between text-xs mb-0.5">
            <span>
              {cat.label} — <span className="text-zinc-400 italic">{cat.deus}</span>
            </span>
            <span>{cat.percent}%</span>
          </div>

          <div className="w-full bg-[#333] rounded h-1.5 overflow-hidden">
            <div
              className={`${cat.cor} h-1.5 rounded group-hover:scale-x-105 transition-transform duration-300`}
              style={{ width: `${cat.percent}%` }}
            />
          </div>

          <div className="text-[10px] text-zinc-400 mt-0.5">{cat.valor}</div>
        </div>
      ))}
    </section>
  )
}
