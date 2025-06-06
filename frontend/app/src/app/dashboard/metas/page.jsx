// /app/dashboard/metas/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiLoader, FiArchive, FiTarget } from "react-icons/fi";

// Componentes
import Sidebar from '../../components/DashBoard/Sidebar';
import Header from '../../components/DashBoard/Header';
import Footer from '../../components/DashBoard/Footer.jsx';
import GoalCard from '../../components/Goals/GoalCard';
import GoalForm from '../../components/Goals/GoalForm';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function MetasPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({});
  const [metas, setMetas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [editMeta, setEditMeta] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    try {
      const [resMetas, resTransacoes] = await Promise.all([
        fetch('http://localhost:3001/usuario/dashboard/metas', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3001/usuario/dashboard/extratos', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!resMetas.ok || !resTransacoes.ok) throw new Error("Falha ao carregar dados.");
      
      const dataMetas = await resMetas.json();
      const dataTransacoes = await resTransacoes.json();
      setMetas(dataMetas.sort((a,b) => b.ano - a.ano || b.mes - a.mes));
      setTransacoes(dataTransacoes);
    } catch (error) {
      toast.error(`Erro ao buscar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Sua lógica de autenticação inicial
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('http://localhost:3001/usuario/autenticado', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject('Sessão inválida'))
      .then(data => setUsuario(data))
      .catch(() => router.push('/login'));
    
    fetchData();
  }, [router]);

  const handleFormSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setIsSubmitting(true);
    const toastId = toast.loading(isEdit ? 'Salvando meta...' : 'Criando meta...');

    try {
      const formData = new FormData(e.target);
      const dados = Object.fromEntries(formData);
      dados.valor_limite = parseFloat(String(dados.valor_limite).replace(',', '.'));

      if(isNaN(dados.valor_limite) || dados.valor_limite <= 0) throw new Error("Valor limite inválido.");

      const url = isEdit ? `http://localhost:3001/usuario/dashboard/metas/${editMeta.id}` : 'http://localhost:3001/usuario/dashboard/metas';
      const method = isEdit ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const errorData = await resposta.json().catch(() => ({}));
        throw new Error(errorData.err || 'Falha ao salvar a meta.');
      }

      await fetchData();
      toast.success(isEdit ? 'Meta atualizada!' : 'Meta criada!', { id: toastId });
      
      if (isEdit) setEditMeta(null);
      else setShowForm(false);

    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta meta?")) return;
    const token = localStorage.getItem('token');
    const toastId = toast.loading('Excluindo meta...');
    try {
      const res = await fetch(`http://localhost:3001/usuario/dashboard/metas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erro ao excluir.");
      
      await fetchData();
      toast.success('Meta excluída!', { id: toastId });
    } catch(error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const metasComProgresso = useMemo(() => {
    return metas.map(meta => {
      const gastoAtual = transacoes
        .filter(t => t.tipo === 'saida' && new Date(t.data).getMonth() + 1 === meta.mes && new Date(t.data).getFullYear() === meta.ano)
        .reduce((acc, t) => acc + Number(t.valor), 0);
      return { ...meta, gastoAtual };
    });
  }, [metas, transacoes]);

  return (
    <div className="flex font-sans bg-slate-950 text-slate-100 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(249,115,22,0.15),_transparent_30%)]" />
      <Toaster position="bottom-right" />
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header usuario={usuario} />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">Gerenciador de Metas</h1>
                <p className="text-slate-400 mt-1">Defina seus objetivos e acompanhe seu progresso para a glória.</p>
              </div>
              <motion.button onClick={() => setEditMeta({})} className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiPlus />Criar Meta
              </motion.button>
            </header>
            
            <AnimatePresence>
              {isLoading ? (
                <div className="text-center py-16"><FiLoader className="animate-spin text-orange-500 mx-auto" size={48}/></div>
              ) : metasComProgresso.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metasComProgresso.map(meta => (
                    <GoalCard 
                      key={meta.id} 
                      meta={meta} 
                      gastoAtual={meta.gastoAtual} 
                      onEdit={setEditMeta} 
                      onDelete={handleDelete}
                      isSubmitting={isSubmitting}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16 text-slate-500"><FiArchive size={48} className="mx-auto mb-4" /><p>Nenhuma meta criada ainda.</p><p>Que tal definir seu primeiro objetivo?</p></div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Footer />
      </main>

      {/* MODAL PARA CRIAR/EDITAR META */}
      <AnimatePresence>
        {editMeta && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditMeta(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg">
              <GoalForm
                onSubmit={e => handleFormSubmit(e, !!editMeta.id)}
                isSubmitting={isSubmitting}
                initialData={editMeta.id ? { ...editMeta, valor_limite: String(editMeta.valor_limite) } : { mes: new Date().getMonth() + 1, ano: new Date().getFullYear() }}
                isEdit={!!editMeta.id}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}