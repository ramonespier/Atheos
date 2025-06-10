// /app/dashboard/metas/page.jsx (VERSÃO FINAL, ULTRA-AVANÇADA E COMPLETA)
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiLoader, FiArchive, FiMoreVertical, FiEdit, FiTrash2, FiTarget, FiCalendar, FiDollarSign, FiTrendingUp, FiAlertTriangle, FiX } from "react-icons/fi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Componentes
import Sidebar from '../../components/DashBoard/Sidebar';
import Header from '../../components/DashBoard/Header';
import Footer from '../../components/DashBoard/Footer.jsx';
import GoalForm from '../../components/Goals/GoalForm';
import InvestmentModal from "@/app/components/Investimento/Investimento";

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// =================================================================================
// COMPONENTE: GRÁFICO GERAL DAS METAS
// =================================================================================
function GoalsOverviewChart({ metas }) {
  const chartData = useMemo(() => {
    const labels = metas.map(m => m.nome);
    const data = metas.map(m => parseFloat(m.valorInvestido));
    return {
      labels,
      datasets: [{
        label: 'Valor Investido',
        data,
        // NOVA PALETA DE CORES LARANJA
        backgroundColor: [
          'rgba(251, 146, 60, 0.9)', // orange-400
          'rgba(249, 115, 22, 0.9)', // orange-500
          'rgba(234, 88, 12, 0.9)',  // orange-600
          'rgba(217, 70, 2, 0.9)',   // orange-700
          'rgba(194, 65, 12, 0.9)',  // orange-800
          'rgba(154, 52, 18, 0.9)',  // orange-900
        ],
        borderColor: 'rgba(15, 23, 42, 0.8)',
        borderWidth: 2,
        hoverOffset: 8
      }]
    };
  }, [metas]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  const totalInvestido = metas.reduce((acc, meta) => acc + parseFloat(meta.valorInvestido), 0);
  if (totalInvestido === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
    >
      <div className="relative h-64 md:h-72">
        <Doughnut data={chartData} options={options} />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">Visão Geral das Metas</h2>
        <p className="text-slate-400 mt-2">Distribuição dos seus investimentos nos seus principais objetivos.</p>
        <div className="mt-6 bg-slate-800/50 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Total Investido em Metas</p>
          <p className="text-2xl font-bold text-green-400">{totalInvestido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>
    </motion.div>
  );
}

// =================================================================================
// COMPONENTE: NOVO CARD DE META ULTRA-AVANÇADO
// =================================================================================
function GoalCard({ meta, onEdit, onDelete, onInvest, onWithdraw }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const progresso = (parseFloat(meta.valorDaMeta) || 0) > 0 ? ((parseFloat(meta.valorInvestido) || 0) / parseFloat(meta.valorDaMeta)) * 100 : 0;
  
  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
      initial="hidden" animate="visible" exit="hidden"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
      className="relative flex flex-col bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden p-6 h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2"><FiTarget className="text-orange-400" /> {meta.nome}</h3>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2"><FiCalendar /> Objetivo: {String(meta.mes).padStart(2, '0')}/{meta.ano}</p>
        </div>
        <div className="relative">
          <motion.button whileTap={{ scale: 0.8 }} onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-400 hover:text-white">
            <FiMoreVertical />
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button onClick={() => { onEdit(); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-md"><FiEdit /> Editar</button>
                <button onClick={() => { onDelete(); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 rounded-md"><FiTrash2 /> Excluir</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-grow space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <p className="text-xs text-green-400">Investido</p>
            <p className="text-lg font-semibold">{parseFloat(meta.valorInvestido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Meta</p>
            <p className="text-lg font-semibold">{parseFloat(meta.valorDaMeta).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-slate-300">Progresso</span>
            <span className="font-bold text-orange-400">{progresso.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-4">
        <motion.button onClick={onWithdraw} whileTap={{ scale: 0.95 }} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-colors">
          <FiDollarSign /> Retirar
        </motion.button>
        <motion.button onClick={onInvest} whileTap={{ scale: 0.95 }} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/40">
          <FiTrendingUp /> Investir
        </motion.button>
      </div>
    </motion.div>
  );
}

// =================================================================================
// COMPONENTE PRINCIPAL DA PÁGINA
// =================================================================================
export default function MetasPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({});
  const [metas, setMetas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [editMeta, setEditMeta] = useState(null);
  const [investimento, setInvestimento] = useState({ isOpen: false, meta: null, type: '' });
  const [metaToDelete, setMetaToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    
    setIsLoading(true);
    try {
      const fetchOptions = { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' };
      const [resMetas, resTransacoes, resSaldo] = await Promise.all([
        fetch('http://localhost:3001/usuario/dashboard/metas', fetchOptions),
        fetch('http://localhost:3001/usuario/dashboard/extratos', fetchOptions),
        fetch('http://localhost:3001/usuario/dashboard/saldo', fetchOptions) 
      ]);
      if (!resMetas.ok || !resTransacoes.ok || !resSaldo.ok) throw new Error("Falha ao carregar dados.");
      
      const dataMetas = await resMetas.json();
      const dataTransacoes = await resTransacoes.json();
      const dataSaldo = await resSaldo.json();
      
      setMetas(dataMetas);
      setTransacoes(dataTransacoes);
      setSaldoAtual(Number(dataSaldo[0]?.saldo) || 0);
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
      localStorage.removeItem('token'); router.push('/login');
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('http://localhost:3001/usuario/autenticado', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject('Sessão inválida'))
      .then(data => setUsuario(data))
      .catch(() => { localStorage.removeItem('token'); router.push('/login'); });
    fetchData();
  }, [router]);
  
  const handleFormSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Salvando...');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData(e.target);
      const dados = Object.fromEntries(formData);
      dados.valorDaMeta = parseFloat(String(dados.valorDaMeta).replace(',', '.'));
      if (isNaN(dados.valorDaMeta) || dados.valorDaMeta <= 0) throw new Error("Valor limite inválido.");
      const url = isEdit ? `http://localhost:3001/usuario/dashboard/metas/${editMeta.id}` : 'http://localhost:3001/usuario/dashboard/metas';
      const method = isEdit ? 'PUT' : 'POST';
      const resposta = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
      if (!resposta.ok) throw new Error('Falha ao salvar a meta.');
      toast.success('Meta salva!', { id: toastId });
      await fetchData();
      setEditMeta(null);
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!metaToDelete) return; 
    const toastId = toast.loading('Excluindo meta e transações...');
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const transacoesParaDeletar = transacoes.filter(
        t => t.nome === `Depósito na Meta: ${metaToDelete.nome}` ||
             t.nome === `Retirada da Meta: ${metaToDelete.nome}`
      );
      
      const promessasDelecaoTransacoes = transacoesParaDeletar.map(t =>
        fetch(`http://localhost:3001/usuario/dashboard/extratos/${t.id}`, { method: 'DELETE', headers })
      );
      const promessaDelecaoMeta = fetch(`http://localhost:3001/usuario/dashboard/metas/${metaToDelete.id}`, { method: 'DELETE', headers });
      
      const respostas = await Promise.all([...promessasDelecaoTransacoes, promessaDelecaoMeta]);
      
      for (const res of respostas) {
        if (!res.ok) throw new Error('Falha em uma das operações de exclusão.');
      }
      
      toast.success('Meta e transações excluídas!', { id: toastId });
      window.dispatchEvent(new CustomEvent('saldoAtualizado'));
      await fetchData();
    } catch (error) {
      toast.error(`Erro: ${error.message}`, { id: toastId });
      await fetchData();
    } finally {
      setIsSubmitting(false);
      setMetaToDelete(null);
    }
  };

  const handleInvestmentSubmit = async (valor) => {
    const valorNumerico = parseFloat(String(valor).replace(',', '.'));
    if (!investimento.isOpen || !investimento.meta) return;
    if (isNaN(valorNumerico) || valorNumerico <= 0) return toast.error('Valor inválido.');
    const { meta, type } = investimento;
    const token = localStorage.getItem('token');
    if (type === 'investir' && saldoAtual < valorNumerico) return toast.error('Saldo insuficiente para este investimento.');
    if (type === 'retirar' && valorNumerico > parseFloat(meta.valorInvestido)) return toast.error('Não é possível retirar mais do que o valor investido.');

    setIsSubmitting(true);
    const toastId = toast.loading(`${type === 'investir' ? 'Depositando' : 'Retirando'}...`);
    try {
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      await fetch(`http://localhost:3001/usuario/dashboard/metas/${meta.id}`, {
        method: 'PUT', headers, body: JSON.stringify({ valor: valorNumerico, operacao: type })
      });
      await fetch('http://localhost:3001/usuario/dashboard/extratos', {
        method: 'POST', headers, body: JSON.stringify({
          nome: type === 'investir' ? `Depósito na Meta: ${meta.nome}` : `Retirada da Meta: ${meta.nome}`,
          valor: valorNumerico,
          tipo: type === 'investir' ? 'saida' : 'entrada',
          descricao: `Movimentação automática referente à meta '${meta.nome}'.`
        })
      });
      toast.success('Operação realizada com sucesso!', { id: toastId });
      window.dispatchEvent(new CustomEvent('saldoAtualizado'));
      await fetchData();
      setInvestimento({ isOpen: false, meta: null, type: '' });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex font-sans bg-slate-950 text-slate-100 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(249,115,22,0.15),_transparent_30%)]" />
      <Toaster position="bottom-right" toastOptions={{
        className: "bg-slate-800 border border-slate-700 text-white",
        success: { iconTheme: { primary: '#34d399', secondary: '#1e293b' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#1e293b' } },
      }}/>
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header usuario={usuario} />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">Gerenciador de Metas</h1>
                <p className="text-slate-400 mt-1">Defina seus objetivos e acompanhe seu progresso.</p>
              </div>
              <motion.button onClick={() => setEditMeta({})} className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/40" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiPlus />Criar Meta
              </motion.button>
            </header>
            
            {isLoading ? (
              <div className="text-center py-16"><FiLoader className="animate-spin text-orange-500 mx-auto" size={48} /></div>
            ) : (
              <>
                <GoalsOverviewChart metas={metas} />
                <AnimatePresence>
                  {metas.length > 0 ? (
                    <motion.div layout variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {metas.sort((a,b) => (parseFloat(b.valorDaMeta) - parseFloat(b.valorInvestido)) - (parseFloat(a.valorDaMeta) - parseFloat(a.valorInvestido))).map(meta => (
                        <GoalCard
                          key={meta.id} 
                          meta={meta}
                          onEdit={() => setEditMeta(meta)}
                          onDelete={() => setMetaToDelete(meta)}
                          onInvest={() => setInvestimento({ isOpen: true, meta, type: 'investir' })}
                          onWithdraw={() => setInvestimento({ isOpen: true, meta, type: 'retirar' })}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-16 text-slate-500 bg-slate-900/30 rounded-2xl">
                      <FiArchive size={48} className="mx-auto mb-4" />
                      <p className="font-semibold text-lg">Nenhuma meta criada ainda.</p>
                      <p>Clique em "Criar Meta" para começar a planejar seu futuro.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
        <Footer />
      </main>
      
      <AnimatePresence>{editMeta && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditMeta(null)}><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg"><GoalForm onSubmit={(e) => handleFormSubmit(e, !!editMeta.id)} isSubmitting={isSubmitting} initialData={editMeta.id ? { ...editMeta } : {}} isEdit={!!editMeta.id} /></motion.div></motion.div>)}</AnimatePresence>
      <InvestmentModal isOpen={investimento.isOpen} type={investimento.type} onClose={() => setInvestimento({ isOpen: false, meta: null, type: '' })} onSubmit={handleInvestmentSubmit} isSubmitting={isSubmitting} />
      
      <AnimatePresence>
        {metaToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setMetaToDelete(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 p-6 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><FiAlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Confirmar Exclusão da Meta</h3>
              <p className="text-slate-400 mb-2">Tem certeza que deseja excluir a meta <strong className="text-white">"{metaToDelete.nome}"</strong>?</p>
              <p className="text-sm bg-yellow-500/10 text-yellow-400 rounded-md p-3 mb-6"><strong>Atenção:</strong> Todas as transações de depósito e retirada associadas a esta meta também serão excluídas permanentemente.</p>
              <div className="flex justify-center gap-4">
                <button type="button" onClick={() => setMetaToDelete(null)} className="font-semibold py-3 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 w-full" disabled={isSubmitting}>Cancelar</button>
                <motion.button type="button" onClick={handleDelete} disabled={isSubmitting} className="font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg disabled:opacity-50 w-full" whileTap={{ scale: 0.95 }}>
                    {isSubmitting ? <FiLoader className="animate-spin mx-auto" /> : 'Sim, Excluir Tudo'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}