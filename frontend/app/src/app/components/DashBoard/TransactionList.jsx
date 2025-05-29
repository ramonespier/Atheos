'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function TransactionList() {
  const [transferencias, setTransferencias] = useState([])
  const [erro, setErro] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null)

  useEffect(() => {
    const buscarTransferencias = async () => {
      const token = localStorage.getItem('token')

      try {
        const resposta = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!resposta.ok) throw new Error('Erro ao carregar transferências')

        const dadosTransferencias = await resposta.json()
        setTransferencias(dadosTransferencias)
      } catch (error) {
        setErro(error.message)
      }
    }

    buscarTransferencias()
  }, [])

  function toggleExpand(idx) {
    setExpandedIndex(expandedIndex === idx ? null : idx)
  }

  return (
    <section className="bg-[#1C1B18] text-white p-6 rounded flex-1">
      <h3 className="text-lg font-bold mb-4">Transações Recentes do Mês</h3>

      {erro && (
        <div className="bg-red-800 text-white p-3 rounded mb-4">
          Erro: {erro}
        </div>
      )}

      {transferencias.length === 0 ? (
        <div className="text-zinc-400">Nenhuma transação encontrada.</div>
      ) : (
        <ul className="space-y-2">
          {transferencias.map((item, idx) => {
            const isExpanded = expandedIndex === idx
            const isPositive = item.tipo === 'entrada'
            const descriptionId = `desc-${idx}`

            return (
              <li
                key={item.id}
                className={`border-b border-[#333] pb-2 cursor-pointer select-none transition-all duration-200 ${
                  isExpanded ? 'bg-zinc-1000 scale-[1.02] shadow-md border-yellow-400' : 'hover:bg-zinc-1900 hover:scale-[1.02] hover:shadow-md'
                }`}
                onClick={() => toggleExpand(idx)}
                aria-expanded={isExpanded}
                aria-controls={descriptionId}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleExpand(idx)
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`w-3 h-3 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-yellow-400' : 'text-zinc-400'
                      }`}
                    />
                    <span>{item.nome}</span>
                  </div>
                  <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                    {isPositive ? '+' : '-'}R$ {Number(item.valor).toFixed(2)}
                  </span>
                </div>

                {isExpanded && (
                  <p
                    id={descriptionId}
                    className="mt-2 text-sm text-zinc-400"
                  >
                    {item.descricao}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <button className="mt-4 text-sm hover:text-yellow-400 cursor-pointer">
        Ver todas as transações →
      </button>
    </section>
  )
}
