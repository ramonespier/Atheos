export default function FinancialGoals() {
    return (
      <section className="bg-[#1C1B18] text-white p-6 rounded flex-1">
        <h3 className="text-lg font-bold mb-4">Metas Financeiras</h3>
        {[
          { label: 'Fundo de emergência', percent: 53 },
          { label: 'Viagem para Grécia', percent: 31 },
          { label: 'Novo computador', percent: 24 }
        ].map((goal, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{goal.label}</span>
              <span>{goal.percent}%</span>
            </div>
            <div className="w-full bg-[#333] rounded h-2">
              <div className="bg-yellow-500 h-2 rounded" style={{ width: `${goal.percent}%` }} />
            </div>
          </div>
        ))}
        <button className="mt-4 text-sm hover:text-yellow-400">Gerenciar metas →</button>
      </section>
    );
  }
  