'use client'

// refactor

import Sidebar from '../../components/DashBoard/Sidebar'
import Header from '../../components/DashBoard/Header'
import Footer from '../../components/DashBoard/Footer'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Trash2, PlusCircle, Edit2, Save, Calendar, DollarSign } from 'lucide-react'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function Metas() {
  const router = useRouter()

  const [usuario, setUsuario] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [metas, setMetas] = useState([])
  const [saldo, setSaldo] = useState({})
  const [novaMeta, setNovaMeta] = useState({
    nome: '',
    valor_limite: '',
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear()
  })
  // const [mostrarEditor, setMostrarEditor] = useState({})

  const buscarDados = async () => {
    const token = localStorage.getItem('token');

    try {
      const [resSaldo, resMetas] = await Promise.all([
        fetch("http://localhost:3001/usuario/dashboard/saldo", {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }),
        fetch("http://localhost:3001/usuario/dashboard/metas", {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
      ]);

      if (!resSaldo.ok) throw new Error('Erro ao carregar saldo');
      if (!resMetas.ok) throw new Error('Erro ao carregar metas');

      const dadosMetas = await resMetas.json()
      const dadosSaldo = await resSaldo.json()

      setMetas(dadosMetas)
      setSaldo(dadosSaldo[0])

    } catch (err) {
      setErro(err.message)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    const buscarUsuario = async () => {
      try {
        const resposta = await fetch('http://localhost:3001/usuario/autenticado', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!resposta.ok) throw new Error('Não autenticado');

        const dadosUsuario = await resposta.json();
        setUsuario(dadosUsuario);
        await buscarDados();
      } catch (error) {
        setErro(error.message);
        router.push('/login');
      }
    };

    buscarUsuario();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNovaMeta(prev => ({
      ...prev,
      [name]: name === 'mes' || name === 'ano' ? parseInt(value) : value
    }))
  }

  const adicionarMeta = async (evento) => {
    evento.preventDefault()
    const token = localStorage.getItem('token')

    try {
      if (novaMeta.mes < 1 || novaMeta.mes > 12) {
        setErro('Mês deve estar entre 1 e 12')
        return
      }

      if (novaMeta.ano < 2006 || novaMeta.ano > 2100) {
        setErro('Ano deve estar entre 2006 e 2100')
        return
      }

      if (parseFloat(novaMeta.valor_limite) <= 0) {
        setErro('O valor deve ser positivo')
        return
      }

      const metaParaEnviar = {
        ...novaMeta,
        valor_limite: parseFloat(novaMeta.valor_limite),
        usuario_id: usuario.id
      }

      const resposta = await fetch('http://localhost:3001/usuario/dashboard/metas', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metaParaEnviar)
      })

      if (!resposta.ok) {
        const erroResposta = await resposta.json()
        throw new Error(erroResposta.message || 'Erro ao adicionar meta')
      }

      await buscarDados()
      setNovaMeta({
        nome: '',
        valor_limite: '',
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear()
      })
      setErro('')
      setMensagem('Meta adicionada com sucesso!')
    } catch (err) {
      setErro(err.message)
    }
  }

  const excluirMeta = async (id) => {
    const token = localStorage.getItem('token')

    try {
      const resposta = await fetch(`http://localhost:3001/usuario/dashboard/metas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!resposta.ok) throw new Error('Erro ao excluir meta');

      setMetas(prev => prev.filter(transf => transf.id !== id));
    } catch (error) {
      setErro(error.message);
    }
  }

  const editarMeta = async (id) => {
    const token = localStorage.getItem('token')

    try {
      const resposta = await fetch(`http://localhost:3001/usuario/dashboard/metas/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!resposta.ok) throw new Error('Erro ao excluir meta');
      setMetas(prev => prev.filter(transf => transf.id !== id));
    } catch (error) {
      setErro(error.message);
    }
  }

  console.log(saldo)

  return (
    <>
      <Header />
      <Sidebar />

      <div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Saldo Disponível</h3>
          <p className="text-2xl font-bold text-blue-900">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(saldo.saldo || 0)}
          </p>
        </div>
      </div>

      <main className="p-4 md:ml-64 h-auto pt-20">
        {erro && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{erro}</div>}
        {mensagem && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">{mensagem}</div>}

        <form onSubmit={adicionarMeta} className="mb-6">
          <div className="grid gap-4 mb-4 md:grid-cols-4 text-black">
            <div>
              <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome da Meta</label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={novaMeta.nome}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                placeholder="Comprar carro novo"
                required
              />
            </div>
            <div>
              <label htmlFor="valor_limite" className="block mb-2 text-sm font-medium">Valor (R$)</label>
              <input
                type="number"
                name="valor_limite"
                id="valor_limite"
                value={novaMeta.valor_limite}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                placeholder="50000.00"
                required
              />
            </div>
            <div>
              <label htmlFor="mes" className="block mb-2 text-sm font-medium">Mês</label>
              <select
                name="mes"
                id="mes"
                value={novaMeta.mes}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ano" className="block mb-2 text-sm font-medium">Ano</label>
              <input
                type="number"
                name="ano"
                id="ano"
                value={novaMeta.ano}
                onChange={handleInputChange}
                min="2006"
                max="2100"
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Adicionar Meta
          </button>
        </form>

        {/* Listagem de metas existentes */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-black">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Meta</th>
                <th className="px-6 py-3">Valor Limite</th>
                <th className="px-6 py-3">Período</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {metas.map((meta) => (
                <tr key={meta.id} className="bg-white border-b">
                  <td className="px-6 py-4">{meta.nome}</td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(meta.valor_limite)}
                  </td>
                  <td className="px-6 py-4">{meta.mes}/{meta.ano}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => editarMeta(meta.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => excluirMeta(meta.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </>
  )


}