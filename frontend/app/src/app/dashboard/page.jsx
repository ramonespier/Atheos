"use client"

import { useState, useEffect } from 'react'
import Sidebar from '../components/DashBoard/Sidebar'
import Header from '../components/DashBoard/Header'
import TransactionList from '../components/DashBoard/TransactionList'
import FinancialGoals from '../components/DashBoard/FinancialGoals'
import CategoryExpenses from '../components/DashBoard/CategoryExpenses'
import Footer from '../components/DashBoard/Footer.jsx'

export default function Home() {
  const [usuario, setUsuario] = useState({});
  const [dadosDashboard, setDadosDashboard] = useState({
    transferencias: [],
    saldo: 0,
    receitas: 0,
    despesas: 0
  });
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const formatarSaldo = (valor) => {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const buscarDadosDashboard = async () => {
    const token = localStorage.getItem('token');
    try {
      // Busca saldo e transações em paralelo
      const [resSaldo, resTransacoes] = await Promise.all([
        fetch('http://localhost:3001/usuario/dashboard/saldo', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:3001/usuario/dashboard/extratos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      
      if (!resSaldo.ok || !resTransacoes.ok) {
        throw new Error('Erro ao carregar dados do dashboard');
      }
      
      const dadosSaldo = await resSaldo.json();
      const dadosTransacoes = await resTransacoes.json();

      // Calcula totais de receitas e despesas
      const receitas = dadosTransacoes
        .filter(t => t.tipo === 'entrada')
        .reduce((acc, curr) => acc + Number(curr.valor), 0);
      
      const despesas = dadosTransacoes
        .filter(t => t.tipo === 'saida')
        .reduce((acc, curr) => acc + Number(curr.valor), 0);
      
      setDadosDashboard({
        transferencias: dadosTransacoes || [],
        saldo: Number(dadosSaldo[0]?.saldo) || 0,
        receitas,
        despesas,
        economias: receitas - despesas
      });
      
    } catch (error) {
      setErro(error.message);
      setDadosDashboard({
        transferencias: [],
        saldo: 0,
        receitas: 0,
        despesas: 0,
        economias: 0
      });
    } finally {
      setCarregando(false);
    }
  };

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
        await buscarDadosDashboard();
        
      } catch (error) {
        setErro(error.message);
        window.location.href = '/login';
      }
    };
    
    buscarUsuario();
  }, []);

  if (carregando) {
    return (
      <div className="flex font-minhaFonte">
        <Sidebar />
        <main className="flex-1 bg-[#121210] min-h-screen flex items-center justify-center">
          <div className="text-white">Carregando...</div>
        </main>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex font-minhaFonte">
        <Sidebar />
        <main className="flex-1 bg-[#121210] min-h-screen flex items-center justify-center">
          <div className="text-red-500">Erro: {erro}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex font-minhaFonte">
      <Sidebar />
      <main className="flex-1 bg-[#121210] min-h-screen flex flex-col">
        <Header />

        {/* CARDS */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Saldo Atual',
              value: dadosDashboard.saldo,
              sign: '',
              desc: 'Abençoado por Zeus',
              color: 'border-yellow-500',
              img: 'https://cdn-icons-png.flaticon.com/512/2918/2918245.png'
            },
            {
              title: 'Receitas do Mês',
              value: dadosDashboard.receitas,
              sign: '+',
              desc: 'Fluxo abundante como os mares de Poseidon',
              color: 'border-blue-500',
              img: 'https://cdn-icons-png.flaticon.com/512/414/414927.png'
            },
            {
              title: 'Despesas do Mês',
              value: dadosDashboard.despesas,
              sign: '-',
              desc: 'Controladas com o rigor de Dionísio',
              color: 'border-purple-500',
              img: 'https://cdn-icons-png.flaticon.com/512/866/866043.png'
            },
            {
              title: 'Economias do Mês',
              value: dadosDashboard.economias,
              sign: dadosDashboard.economias >= 0 ? '+' : '-',
              desc: 'Acumuladas com a sabedoria de Hades',
              color: dadosDashboard.economias >= 0 ? 'border-green-500' : 'border-red-500',
              img: 'https://cdn-icons-png.flaticon.com/512/633/633657.png'
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`
                bg-[#1C1B18] text-white p-4 rounded-lg 
                shadow-md border-2 ${card.color}
                hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer
                flex justify-between items-center gap-4
              `}
            >
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-xl font-bold">
                  {card.sign}{' '}
                  {formatarSaldo(card.value)}
                </p>
                <span className="text-xs text-zinc-400">{card.desc}</span>
              </div>

              <img
                src={card.img}
                alt={card.title}
                className="w-12 h-12 object-contain rounded"
              />
            </div>
          ))}
        </div>

        {/* LISTAS */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionList transacoes={dadosDashboard.transferencias} />
          <FinancialGoals />
        </div>

        <div className="p-6">
          <CategoryExpenses transacoes={dadosDashboard.transferencias} />
        </div>

        <Footer />
      </main>
    </div>
  )
}