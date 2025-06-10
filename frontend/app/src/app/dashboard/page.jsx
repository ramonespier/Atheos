// /app/dashboard/page.js (VERSÃO COM LÓGICA ORIGINAL RESTAURADA)
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

// Componentes
import Sidebar from "../components/DashBoard/Sidebar";
import Header from "../components/DashBoard/Header";
import TransactionList from "../components/DashBoard/TransactionList";
import FinancialGoals from "../components/DashBoard/FinancialGoals";
import Footer from "../components/DashBoard/Footer";
import StatCard from '../components/DashBoard/StatCard';
import DashboardSkeleton from "../components/DashBoard/DashboardSkeleton";
import MonthlyBalanceSummary from "../components/DashBoard/MonthlyBalanceSummary";
import BalanceHistoryChart from "../components/DashBoard/BalanceHistoryChart";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({});
  const [dadosDashboard, setDadosDashboard] = useState({
    transferencias: [], 
    saldo: 0, 
    receitas: 0, // Nome revertido para 'receitas'
    despesas: 0  // Nome revertido para 'despesas'
  });
  const [carregando, setCarregando] = useState(true);

  // Lógica de fetch de dados
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/login");
        return;
    }
    const fetchAllData = async () => {
        try {
            const [resUsuario, resSaldo, resTransacoes] = await Promise.all([
                fetch("http://localhost:3001/usuario/autenticado", { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://localhost:3001/usuario/dashboard/saldo", { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://localhost:3001/usuario/dashboard/extratos", { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!resUsuario.ok || !resSaldo.ok || !resTransacoes.ok) {
                throw new Error("Sessão inválida ou falha ao buscar dados.");
            }

            const dadosUsuario = await resUsuario.json();
            const dadosSaldo = await resSaldo.json();
            const dadosTransacoes = await resTransacoes.json();

            // ================== LÓGICA REVERTIDA E SIMPLIFICADA ==================
            
            // Calcula as receitas TOTAIS de todo o histórico, incluindo as de metas.
            const receitasTotais = dadosTransacoes
                .filter(t => t.tipo === 'entrada')
                .reduce((acc, curr) => acc + Number(curr.valor), 0);

            // Calcula as despesas TOTAIS de todo o histórico, incluindo as de metas.
            const despesasTotais = dadosTransacoes
                .filter(t => t.tipo === 'saida')
                .reduce((acc, curr) => acc + Number(curr.valor), 0);
            
            // =================== FIM DA ALTERAÇÃO ===================

            setUsuario(dadosUsuario);
            setDadosDashboard({
                transferencias: dadosTransacoes || [],
                saldo: Number(dadosSaldo[0]?.saldo) || 0,
                receitas: receitasTotais,
                despesas: despesasTotais,
            });
        } catch (error) {
            toast.error(error.message);
            router.push('/login');
        } finally {
            setCarregando(false);
        }
    };
    fetchAllData();
  }, [router]);

  // Lógica para processar dados do histórico
  const historyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        label: d.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''),
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }

    // A lógica do gráfico também é simplificada para ser consistente com os cards
    const groupedData = dadosDashboard.transferencias
      .reduce((acc, t) => {
          const date = new Date(t.data);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          if (!acc[key]) {
            acc[key] = { receitas: 0, despesas: 0 };
          }
          if (t.tipo === 'entrada') acc[key].receitas += Number(t.valor);
          else acc[key].despesas += Number(t.valor);
          return acc;
    }, {});
    
    return {
      labels: months.map(m => m.label),
      receitas: months.map(m => groupedData[`${m.year}-${m.month}`]?.receitas || 0),
      despesas: months.map(m => groupedData[`${m.year}-${m.month}`]?.despesas || 0),
    };
  }, [dadosDashboard.transferencias]);

  // Atualiza os dados dos cartões para usar os valores totais
  const cardData = [
    { title: "Saldo Atual", value: dadosDashboard.saldo, icon: Wallet, color: "default" },
    { title: "Receitas Totais", value: dadosDashboard.receitas, icon: TrendingUp, color: "green", sign: "+" },
    { title: "Despesas Totais", value: dadosDashboard.despesas, icon: TrendingDown, color: "red", sign: "-" },
  ];

  return (
    <div className="font-sans text-slate-100 selection:bg-orange-500 selection:text-white">
      <div className="fixed left-0 top-0 -z-10 h-full w-full bg-slate-950">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(249,115,22,0.15),_transparent_30%)]" />
      </div>
      <Toaster position="bottom-right" toastOptions={{ className: "bg-slate-800 border border-slate-700 text-white" }} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen flex flex-col">
          <Header usuario={usuario} />

          {carregando ? (
            <DashboardSkeleton />
          ) : (
            <motion.div
              className="flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cardData.map((card, i) => <StatCard key={i} {...card} />)}
              
              <motion.div variants={itemVariants} className="lg:col-span-2">
                {/* O resumo agora mostra os valores totais, não apenas do mês */}
                <MonthlyBalanceSummary receitas={dadosDashboard.receitas} despesas={dadosDashboard.despesas} />
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-1 lg:row-span-2">
                <TransactionList transacoes={dadosDashboard.transferencias} />
              </motion.div>
              
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <FinancialGoals />
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-3">
                <BalanceHistoryChart historyData={historyData} />
              </motion.div>
            </motion.div>
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
}