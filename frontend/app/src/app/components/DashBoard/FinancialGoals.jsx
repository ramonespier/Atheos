// C:\...FinancialGoals.jsx (VERSÃO CORRIGIDA E ALINHADA COM A LÓGICA ULTIMATE)
"use client";
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Target, Loader2, PlusCircle, CheckCircle, Award } from 'lucide-react';
import clsx from 'clsx';

function MiniGoalCard({ meta }) {
  const valorInvestido = parseFloat(meta.valorInvestido || 0);
  const valorDaMeta = parseFloat(meta.valorDaMeta || 1);
  const isCompleted = valorInvestido >= valorDaMeta;
  const progresso = isCompleted ? 100 : (valorInvestido / valorDaMeta) * 100;

  return (
    <motion.div layout variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
      <div className="flex justify-between items-center gap-4">
        <span className="text-sm font-medium text-slate-300 truncate flex items-center gap-2">
          {isCompleted ? <CheckCircle className="text-green-400 shrink-0" size={16} /> : <Target className="text-orange-400 shrink-0" size={16} />}
          {meta.nome}
        </span>
        <span className={clsx("text-sm font-bold shrink-0", isCompleted ? "text-green-400" : "text-orange-400")}>
          {progresso.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
        <motion.div
          className={clsx("h-2 rounded-full", isCompleted ? "bg-green-500" : "bg-gradient-to-r from-orange-500 to-amber-400")}
          initial={{ width: 0 }}
          animate={{ width: `${progresso}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function FinancialGoals() {
  const [metas, setMetas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setIsLoading(false); return; }
    
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/usuario/dashboard/metas', { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' });
        if (!res.ok) throw new Error(`Falha ao carregar metas: ${res.statusText}`);
        const dataMetas = await res.json();
        setMetas(Array.isArray(dataMetas) ? dataMetas : []);
      } catch (error) {
        console.error("Erro no FinancialGoals:", error.message);
        setMetas([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    const handleRevalidate = () => fetchData();
    window.addEventListener('saldoAtualizado', handleRevalidate);
    return () => window.removeEventListener('saldoAtualizado', handleRevalidate);
  }, []);

  const { metasParaExibir, todasConcluidas } = useMemo(() => {
    if (!metas || metas.length === 0) return { metasParaExibir: [], todasConcluidas: false };

    const activeGoals = metas.filter(m => parseFloat(m.valorInvestido || 0) < parseFloat(m.valorDaMeta || 1));
    const completedGoals = metas.filter(m => parseFloat(m.valorInvestido || 0) >= parseFloat(m.valorDaMeta || 1));

    activeGoals.sort((a, b) => (parseFloat(b.valorInvestido || 0) / parseFloat(b.valorDaMeta || 1)) - (parseFloat(a.valorInvestido || 0) / parseFloat(a.valorDaMeta || 1)));
    completedGoals.sort((a, b) => new Date(b.atualizado_em || b.criado_em || 0) - new Date(a.atualizado_em || a.criado_em || 0));

    const displayList = [...activeGoals, ...completedGoals].slice(0, 3);
    
    return { metasParaExibir: displayList, todasConcluidas: activeGoals.length === 0 && completedGoals.length > 0 };
  }, [metas]);

  return (
    <motion.div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2"><Target className="text-orange-400" />Progresso das Metas</h3>
        <Link href="/dashboard/metas" className="text-sm text-orange-400 hover:text-orange-300 transition-colors hover:underline">Gerenciar</Link>
      </div>
      <div className="flex-grow flex flex-col justify-center min-h-[150px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center">
              <Loader2 className="animate-spin text-orange-500" size={32}/>
            </motion.div>
          ) : metasParaExibir.length > 0 ? (
            <motion.div key="goals-list" className="space-y-5" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
              {metasParaExibir.map(meta => <MiniGoalCard key={meta.id} meta={meta} />)}
            </motion.div>
          ) : todasConcluidas ? (
            <motion.div key="all-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-green-400">
              <Award size={40} className="mx-auto mb-3"/><p className="font-semibold text-slate-300">Parabéns!</p><p className="text-sm text-slate-400">Todas as suas metas foram alcançadas.</p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-slate-500">
              <Target size={40} className="mx-auto mb-3"/><p className="font-semibold text-slate-400">Nenhuma meta em andamento.</p><p className="text-sm">Que tal começar a planejar seu próximo objetivo?</p>
              <Link href="/dashboard/metas" className="mt-4 inline-flex items-center gap-2 text-sm text-white bg-orange-500/80 hover:bg-orange-500 font-semibold px-4 py-2 rounded-lg transition-colors"><PlusCircle size={16} />Criar Nova Meta</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}