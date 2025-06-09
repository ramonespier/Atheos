// /app/dashboard/metas/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiLoader, FiArchive } from "react-icons/fi";

// Componentes
import Sidebar from '../../components/DashBoard/Sidebar';
import Header from '../../components/DashBoard/Header';
import Footer from '../../components/DashBoard/Footer.jsx';
import GoalCard from '../../components/Goals/GoalCard';
import GoalForm from '../../components/Goals/GoalForm';
import InvestmentModal from "@/app/components/Investimento/Investimento";

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function MetasPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({});
  const [metas, setMetas] = useState([]);
  const [extrato, setExtrato] = useState({ saldo: 0, transacoes: [] });
  const [editMeta, setEditMeta] = useState(null);
  const [investimento, setInvestimento] = useState({ isOpen: false, meta: null, type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const fetchOptions = {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store' 
      };
      const [resMetas, resExtrato] = await Promise.all([
        fetch('http://localhost:3001/usuario/dashboard/metas', fetchOptions),
        fetch('http://localhost:3001/usuario/dashboard/extratos', fetchOptions)
      ]);
      if (!resMetas.ok || !resExtrato.ok) throw new Error("Falha ao carregar dados.");
      const dataMetas = await resMetas.json();
      const dataExtrato = await resExtrato.json();
      
      // Força a atualização do React criando uma nova referência de array
      setMetas([...dataMetas]);
      setExtrato(dataExtrato);
      
    } catch (error) {
      toast.error(`Erro ao buscar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('http://localhost:3001/usuario/autenticado', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject('Sessão inválida'))
      .then(data => setUsuario(data))
      .catch(() => router.push('/login'));
    fetchData(); 
  }, [router]);

  // Lógica para Criar/Editar
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

  // Lógica para Deletar
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza?")) return;
    const token = localStorage.getItem('token');
    const toastId = toast.loading('Excluindo...');
    try {
      const res = await fetch(`http://localhost:3001/usuario/dashboard/metas/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error("Erro ao excluir.");
      toast.success('Meta excluída!', { id: toastId });
      await fetchData();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  // Lógica para Investir/Retirar (com fluxo simples e correto)
  const handleInvestmentSubmit = async (valor) => {
    if (!valor || isNaN(valor) || valor <= 0) { toast.error('Valor inválido'); return; }
    if (!investimento.isOpen || !investimento.meta) return;

    const { meta, type } = investimento;
    const token = localStorage.getItem('token');
    const valorNumerico = parseFloat(valor);

    if (type === 'investir' && extrato.saldo < valorNumerico) { toast.error('Saldo geral insuficiente.'); return; }
    
    setIsSubmitting(true);
    const toastId = toast.loading(`${type}...`);
    try {
      const res = await fetch(`http://localhost:3001/usuario/dashboard/metas/${meta.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: valorNumerico, operacao: type })
      });
      if (!res.ok) throw new Error('Falha na operação.');
      
      toast.success('Operação realizada!', { id: toastId });
      await fetchData();
      setInvestimento({ isOpen: false, meta: null, type: '' });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const metasComProgresso = useMemo(() => {
    return metas.sort((a,b) => (b.ano - a.ano) || (b.mes - a.mes)).map(meta => {
        const valorInvestidoNum = parseFloat(meta.valorInvestido) || 0;
        const valorDaMetaNum = parseFloat(meta.valorDaMeta) || 0;
        const progresso = valorDaMetaNum > 0 ? (valorInvestidoNum / valorDaMetaNum) * 100 : 0;
        return { ...meta, valorAtual: valorInvestidoNum, progresso };
    });
  }, [metas]);

  return (
    <div className="flex font-sans bg-slate-950 text-slate-100 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(249,115,22,0.15),_transparent_30%)]" />
      <Toaster position="bottom-right" />
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header usuario={usuario} saldo={extrato.saldo} />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">Gerenciador de Metas</h1>
                <p className="text-slate-400 mt-1">Defina seus objetivos e acompanhe seu progresso.</p>
              </div>
              <motion.button onClick={() => setEditMeta({})} className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiPlus />Criar Meta
              </motion.button>
            </header>
            <AnimatePresence>
              {isLoading ? (
                <div className="text-center py-16"><FiLoader className="animate-spin text-orange-500 mx-auto" size={48} /></div>
              ) : metasComProgresso.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metasComProgresso.map(meta => (
                    <GoalCard
                      // A SOLUÇÃO FINAL: Uma "etiqueta" que muda quando o valor investido muda.
                      // Isso força o React a destruir o card antigo e criar um novo do zero.
                      key={`${meta.id}-${meta.valorInvestido}`}
                      
                      meta={meta} // Passa o objeto meta, que já tem o progresso calculado.
                      
                      onEdit={() => setEditMeta(meta)}
                      onDelete={() => handleDelete(meta.id)}
                      onInvest={() => setInvestimento({ isOpen: true, meta, type: 'investir' })}
                      onWithdraw={() => setInvestimento({ isOpen: true, meta, type: 'retirar' })}
                      isSubmitting={isSubmitting}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16 text-slate-500"><FiArchive size={48} className="mx-auto mb-4" /><p>Nenhuma meta criada ainda.</p></div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Footer />
      </main>
      
      {/* Modais de Criar/Editar e de Investir */}
      <AnimatePresence>
        {editMeta && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditMeta(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg">
              <GoalForm onSubmit={(e) => handleFormSubmit(e, !!editMeta.id)} isSubmitting={isSubmitting} initialData={editMeta.id ? { ...editMeta } : {}} isEdit={!!editMeta.id} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <InvestmentModal isOpen={investimento.isOpen} type={investimento.type} onClose={() => setInvestimento({ isOpen: false, meta: null, type: '' })} onSubmit={handleInvestmentSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}