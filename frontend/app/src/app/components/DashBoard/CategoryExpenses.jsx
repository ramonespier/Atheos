export default function CategoryExpenses() {
    return (
      <section className="bg-[#1C1B18] text-white p-6 rounded">
        <h3 className="text-lg font-bold mb-4">Despesas por Categoria</h3>
        {[
          { label: 'Moradia', valor: 'R$ 800,00', percent: 89 },
          { label: 'Alimentação', valor: 'R$ 900,00', percent: 90 },
          { label: 'Transporte', valor: 'R$ 320,00', percent: 91 }
        ].map((cat, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{cat.label}</span>
              <span>{cat.percent}%</span>
            </div>
            <div className="w-full bg-[#333] rounded h-2">
              <div className="bg-orange-500 h-2 rounded" style={{ width: `${cat.percent}%` }} />
            </div>
            <div className="text-xs">{cat.valor}</div>
          </div>
        ))}
      </section>
    );
  }
  