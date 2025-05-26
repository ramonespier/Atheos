'use client'

import { useState } from 'react';

export default function TransactionList() {
  const transactions = [
    { title: 'Aluguel de Maio', amount: -1000, description: 'Pagamento do aluguel do apartamento' },
    { title: 'Salário de Maio', amount: 3500, description: 'Recebimento do salário mensal' },
    { title: 'Supermercado', amount: -350, description: 'Compras de supermercado' },
    { title: 'Cinema com amigos', amount: -50, description: 'Diversão no cinema' },
    { title: 'Combustível', amount: -120, description: 'Abastecimento do carro' }
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  function toggleExpand(idx) {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  }

  return (
    <section className="bg-[#1C1B18] text-white p-6 rounded flex-1">
      <h3 className="text-lg font-bold mb-4">Transações Recentes do Mês</h3>
      <ul className="space-y-2 ease-in-out">
        {transactions.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const isPositive = item.amount > 0;
          return (
            <li
              key={idx}
              className={`border-b border-[#333] pb-2 cursor-pointer select-none transition-all duration-200
    hover:bg-zinc-800 hover:scale-[1.02] hover:shadow-md`}
              onClick={() => toggleExpand(idx)}
              aria-expanded={isExpanded}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(idx) }}
            >

              <div className="flex justify-between">
                <span>{item.title}</span>
                <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                  {isPositive ? '+' : '-'}R$ {Math.abs(item.amount).toFixed(2)}
                </span>
              </div>
              {isExpanded && (
                <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
              )}
            </li>
          );
        })}
      </ul>
      <button className="mt-4 text-sm hover:text-yellow-400 cursor-pointer">Ver todas as transações →</button>
    </section>
  );
}
