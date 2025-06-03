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

  const [usuario, setUsuario] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [metas, setMetas] = useState({})
  const [novaMeta, setNovaMeta] = useState({})
  const [mostrarEditor, setMostrarEditor] = useState([])

  const buscarMetas = async () => {
    const token = localStorage('token');

    try {
      const resposta = fetch("http://localhost:3000/usuario/dashboard/metas", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!resposta.ok) throw new Error('Erro ao carregar transferências');

      const dadosMetas = await resposta.json()
      setMetas(dadosMetas)
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
        await buscarMetas();
      } catch (error) {
        setErro(error.message);
        router.push('/login');
      }
    };

    buscarUsuario();
  }, []);

  const adicionarMeta = async (evento) => {
    evento.preventDefault()
    const token = localStorage.getItem('token')

    try {
      const formData = new FormData(evento.target)
      const dados = Object.fromEntries(formData)
      const valor = dados.valor.toString();

      if (valor.length > 10) {
        setErro('O valoe não pode exceder 10 caracteres')
        return;
      }

      const resposta = await fetch('http://localhost:3000/usuario/dashboard/metas', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.strigify(dados)
      });

      if (!resposta.ok) throw new Error('Erro ao adicionar meta');

      await buscarMetas()
      evento.target.reset()
      setErro(null)
    } catch (err) {
      setErro('Erro ao adicionar meta nova ' + err)
    }
  }

  return (
    <>
      <Header />
      <Sidebar />

      <form onSubmit={adicionarMeta}>
        <input type="text" placeholder='Nome da meta' />
        <input type="number" placeholder='Valor da meta' />
        

      </form>


      <Footer />
    </>
  )


}