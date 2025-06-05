'use client'



import Sidebar from '../../components/DashBoard/Sidebar'
import Header from '../../components/DashBoard/Header'
import Footer from '../../components/DashBoard/Footer'
import { useState } from 'react'

import { motion } from 'framer-motion'
import { CheckCircle, Trash2, PlusCircle } from 'lucide-react'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function Metas() {
  const [metas, setMetas] = useState([
    { id: 1, nome: 'Comprar PC Gamer', valor: 5000, investido: 1500, concluida: false },
    { id: 2, nome: 'Viajar para o Japão', valor: 10000, investido: 5000, concluida: true },
  ])

  const [novaMeta, setNovaMeta] = useState('')
  const [novoValor, setNovoValor] = useState('')
  const [novoInvestimento, setNovoInvestimento] = useState({})

  const addMeta = () => {
    if (novaMeta.trim() !== '' && novoValor > 0) {
      setMetas([
        ...metas,
        { id: Date.now(), nome: novaMeta, valor: parseFloat(novoValor), investido: 0, concluida: false }
      ])
      setNovaMeta('')
      setNovoValor('')










    }
  }

  const toggleMeta = (id) => {
    setMetas(metas.map(m => m.id === id ? { ...m, concluida: !m.concluida } : m))
  }

  const removeMeta = (id) => {
    setMetas(metas.filter(m => m.id !== id))
  }

  const atualizarInvestimento = (id) => {
    const valor = parseFloat(novoInvestimento[id] || 0)
    if (!isNaN(valor) && valor >= 0) {
      setMetas(metas.map(m => m.id === id ? { ...m, investido: valor } : m))
      setNovoInvestimento({ ...novoInvestimento, [id]: '' })











































    }
  }

  const concluidas = metas.filter(m => m.concluida).length
  const pendentes = metas.length - concluidas

  const chartData = {
    labels: ['Concluídas', 'Pendentes'],
    datasets: [
      {
        data: [concluidas, pendentes],
        backgroundColor: ['#10B981', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="flex font-minhaFonte">

      <Sidebar />
      <main className="flex-1 bg-[#121210] min-h-screen flex flex-col">
        <Header />

        <section className="p-8 text-yellow-400">
          <h3 className="text-3xl font-bold mb-6">Minhas Metas</h3>

          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Nova meta"
              value={novaMeta}
              onChange={(e) => setNovaMeta(e.target.value)}
              className="bg-[#1f2937] text-white p-2 rounded"
            />
            <input
              type="number"
              placeholder="Valor R$"
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
              className="bg-[#1f2937] text-white p-2 rounded w-24"
            />
            <button
              onClick={addMeta}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              <PlusCircle size={20} /> Adicionar
            </button>
          </div>

          <ul className="space-y-6">
            {metas.map(meta => {
              const progresso = ((meta.investido / meta.valor) * 100).toFixed(1)

              return (
                <li
                  key={meta.id}
                  className={`flex flex-col gap-4 p-4 rounded shadow-md transition ${
                    meta.concluida ? 'bg-green-900/30' : 'bg-yellow-900/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">{meta.nome}</p>
                      <p className="text-sm text-yellow-500">Valor: R$ {meta.valor.toFixed(2)}</p>
                      <p className="text-sm text-yellow-500">Investido: R$ {meta.investido.toFixed(2)}</p>
                      <p className="text-sm text-yellow-500">Progresso: {progresso}%</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleMeta(meta.id)}
                        className={`p-2 rounded transition ${
                          meta.concluida
                            ? 'bg-green-700 hover:bg-green-800'
                            : 'bg-gray-700 hover:bg-gray-800'
                        }`}
                      >
                        <CheckCircle />
                      </button>
                      <button
                        onClick={() => removeMeta(meta.id)}
                        className="p-2 rounded bg-red-700 hover:bg-red-800 transition"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Investido R$"
                      value={novoInvestimento[meta.id] || ''}
                      onChange={(e) => setNovoInvestimento({ ...novoInvestimento, [meta.id]: e.target.value })}
                      className="bg-[#1f2937] text-white p-2 rounded w-32"
                    />
                    <button
                      onClick={() => atualizarInvestimento(meta.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition"
                    >
                      Atualizar
                    </button>
                  </div>

                  <div className="w-64">
                    <Bar
                      data={{
                        labels: ['Investido', 'Meta'],
                        datasets: [
                          {
                            label: 'R$',
                            data: [meta.investido, meta.valor],
                            backgroundColor: ['#3B82F6', '#FBBF24'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        scales: {
                          y: { beginAtZero: true },
                        },
                      }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 w-64 mx-auto">
            <Doughnut data={chartData} />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}