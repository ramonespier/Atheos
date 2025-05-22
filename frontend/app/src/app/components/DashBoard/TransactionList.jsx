export default function TransactionList() {
    return (
      <section className="bg-[#1C1B18] text-white p-6 rounded flex-1">
        <h3 className="text-lg font-bold mb-4">Transações Recentes</h3>
        <ul className="space-y-2">
          {['Aluguel de Maio', 'Salário de Maio', 'Supermercado', 'Cinema com amigos', 'Combustível'].map((item, idx) => (
            <li key={idx} className="flex justify-between border-b border-[#333] pb-2">
              <span>{item}</span>
              <span className={idx % 2 ? 'text-green-400' : 'text-red-400'}>{idx % 2 ? '+R$' : '-R$'}100,00</span>
            </li>
          ))}
        </ul>
        <button className="mt-4 text-sm hover:text-yellow-400">Ver todas as transações →</button>
      </section>
    );
  }
  