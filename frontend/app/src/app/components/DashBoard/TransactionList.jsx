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
            Authorization: `Bearer ${token}`,
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
    <section className="bg-[#030712] text-yellow-400 p-6 rounded flex-1 shadow-lg shadow-black/80">
      <h3 className="font-bold mb-4 select-none">Transações Recentes do Mês</h3>

      {erro && (
        <div className="bg-red-900 text-yellow-300 p-3 rounded mb-4 select-none">
          Erro: {erro}
        </div>
      )}

      {transferencias.length === 0 ? (
        <div className="text-yellow-600 select-none">Nenhuma transação encontrada.</div>
      ) : (
        <ul className="space-y-2">
          {transferencias.map((item, idx) => {
            const isExpanded = expandedIndex === idx
            const isPositive = item.tipo === 'entrada'
            const descriptionId = `desc-${idx}`

            return (
              <li
                key={item.id}
                className={`border-b border-yellow-700 pb-2 cursor-pointer select-none transition-all duration-200
                  ${isExpanded
                    ? 'bg-yellow-900/20 shadow-yellow-700 shadow-md'
                    : 'hover:bg-yellow-900/10 hover:shadow-yellow-700/30 hover:shadow-md'}
                `}
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
                      className={`w-3 h-3 transition-transform duration-300
                        ${isExpanded ? 'rotate-180 text-yellow-400' : 'text-yellow-600'}
                      `}
                    />
                    <span>{item.nome}</span>
                  </div>
                  <span className={isPositive ? 'text-green-400' : 'text-red-500'}>
                    {isPositive ? '+' : '-'}R$ {Number(item.valor).toFixed(2)}
                  </span>
                </div>

                {isExpanded && (
                  <p id={descriptionId} className="mt-2 text-yellow-300 text-sm">
                    {item.descricao}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <button
        className="mt-4 text-yellow-400 hover:text-yellow-300 cursor-pointer select-none transition-colors duration-200"
        type="button"
      >
        Ver todas as transações →
      </button>
    </section>
  )
}
