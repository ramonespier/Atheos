// components/DashBoard/FinancialGoals.jsx (NOVA VERSÃO FUNCIONAL)
"use client";
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import GoalCard from '../Goals/GoalCard';
import { FiTarget, FiLoader } from 'react-icons/fi';

export default function FinancialGoals() {
  const [metas, setMetas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [resMetas, resTransacoes] = await Promise.all([
          fetch('http://localhost:3001/usuario/dashboard/metas', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/usuario/dashboard/extratos', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (!resMetas.ok || !resTransacoes.ok) throw new Error("Falha ao carregar dados de metas.");
        
        const dataMetas = await resMetas.json();
        const dataTransacoes = await resTransacoes.json();
        setMetas(dataMetas);
        setTransacoes(dataTransacoes);
      } catch (error) {
        console.error("Erro no componente FinancialGoals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const metasDoMesAtual = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    return metas
      .filter(meta => meta.mes === mesAtual && meta.ano === anoAtual)
      .map(meta => {
        const gastoAtual = transacoes
          .filter(t => t.tipo === 'saida' && new Date(t.data).getMonth() + 1 === meta.mes && new Date(t.data).getFullYear() === meta.ano)
          // Aqui você pode adicionar um filtro por categoria se suas metas forem por categoria
          .reduce((acc, t) => acc + Number(t.valor), 0);
        return { ...meta, gastoAtual };
      });
  }, [metas, transacoes]);

  return (
    <div className="relative p-[2px] rounded-2xl bg-white/5 h-full">
      <div className="bg-slate-950 p-6 rounded-[14px] h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Metas do Mês</h3>
          <Link href="/dashboard/metas" className="text-sm text-orange-400 hover:underline">Ver todas</Link>
        </div>
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center"><FiLoader className="animate-spin text-orange-500" size={32}/></div>
        ) : metasDoMesAtual.length > 0 ? (
          <div className="flex-grow space-y-4 overflow-y-auto">
            <AnimatePresence>
              {metasDoMesAtual.map(meta => (
                <GoalCard 
                  key={meta.id} 
                  meta={meta}
                  gastoAtual={meta.gastoAtual}
                  onEdit={() => {}} // Não editável no dashboard
                  onDelete={() => {}} // Não deletável no dashboard
                  isSubmitting={false}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500">
            <FiTarget size={40} className="mb-2"/>
            <p>Nenhuma meta definida para este mês.</p>
            <Link href="/dashboard/metas" className="text-orange-400 hover:underline mt-1 text-sm">Criar uma meta</Link>
          </div>
        )}
      </div>
    </div>
  );
}