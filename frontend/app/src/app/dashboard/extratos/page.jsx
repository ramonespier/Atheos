"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiX, FiPlus, FiLoader, FiAlertTriangle, FiCheckCircle, FiChevronDown, FiInfo, FiSearch, FiTrendingUp, FiTrendingDown, FiArchive } from "react-icons/fi";
import clsx from 'clsx';

// Componentes
import Sidebar from '../../components/DashBoard/Sidebar';
import Header from '../../components/DashBoard/Header';
import Footer from '../../components/DashBoard/Footer.jsx';

// =================================================================================
// LÓGICA FUNCIONAL (COM MODAL DE DELETE)
// =================================================================================

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const modalVariants = { hidden: { scale: 0.95, y: 20 }, visible: { scale: 1, y: 0 }, exit: { scale: 0.95, y: 20 } };

export default function Extratos() {
  const router = useRouter();
  
  // Estados de dados e UI
  const [usuario, setUsuario] = useState({});
  const [transacoes, setTransacoes] = useState([]);
  const [editTransacao, setEditTransacao] = useState(null);
  const [globalError, setGlobalError] = useState(null);
  
  // *** NOVO ESTADO PARA O MODAL DE CONFIRMAÇÃO ***
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  
  // Estados de Ação
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Estados de Filtro/Busca
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const buscarTransferencias = async () => {
    const token = localStorage.getItem('token');
    setIsLoadingData(true);
    try {
      const resposta = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resposta.ok) throw new Error('Falha ao carregar transações.');
      const dadosTransferencias = await resposta.json();
      setTransacoes(dadosTransferencias.sort((a, b) => new Date(b.data) - new Date(a.data)));
      setGlobalError(null);
    } catch (error) {
      setGlobalError(error.message);
      toast.error(`Erro ao buscar dados: ${error.message}`);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const buscarUsuario = async () => {
      try {
        const resposta = await fetch('http://localhost:3001/usuario/autenticado', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error('Sessão expirada ou inválida. Faça login novamente.');
        const dadosUsuario = await resposta.json();
        setUsuario(dadosUsuario);
        await buscarTransferencias();
      } catch (error) {
        setGlobalError(error.message);
        if (error.message.toLowerCase().includes("expirada") || error.message.toLowerCase().includes("inválida")) {
          toast.error(error.message + " Redirecionando...");
          setTimeout(() => router.push('/login'), 2000);
        }
      }
    };
    buscarUsuario();
  }, [router]);

  const validarValor = (valorStr) => {
    const valor = String(valorStr).replace(',', '.');
    if (valor.length > 10) return { isValid: false, message: 'Valor excede 10 caracteres.' };
    const partes = valor.split('.');
    if (partes.length > 1 && partes[1].length > 2) return { isValid: false, message: 'Use no máximo 2 casas decimais.' };
    const numValor = parseFloat(valor);
    if (isNaN(numValor) || numValor <= 0) return { isValid: false, message: 'Valor deve ser um número positivo.' };
    return { isValid: true, message: '' };
  };

  const handleFormSubmit = async (evento, isEdit = false) => {
    evento.preventDefault();
    const token = localStorage.getItem('token');
    setIsSubmitting(true);
    setGlobalError(null);

    const idTransacao = isEdit ? editTransacao.id : null;
    const url = isEdit ? `http://localhost:3001/usuario/dashboard/extratos/${idTransacao}` : 'http://localhost:3001/usuario/dashboard/extratos';
    const method = isEdit ? 'PUT' : 'POST';

    const toastId = toast.loading(isEdit ? 'Salvando...' : 'Adicionando...');

    try {
      const formData = new FormData(evento.target);
      const dados = Object.fromEntries(formData);
      
      const valorValidacao = validarValor(dados.valor);
      if (!valorValidacao.isValid) throw new Error(valorValidacao.message);
      dados.valor = parseFloat(String(dados.valor).replace(',', '.'));

      const resposta = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) {
        const errorData = await resposta.json().catch(() => ({ message: `Erro ${resposta.status}` }));
        throw new Error(errorData.message || 'Falha na operação.');
      }

      await buscarTransferencias();
      toast.success(isEdit ? 'Transação editada!' : 'Transação adicionada!', { id: toastId });
      
      if (isEdit) fecharModalEdicao();
      else {
        setShowForm(false);
        evento.target.reset();
      }
    } catch (error) {
      toast.error(`Erro: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // *** FUNÇÃO DE EXCLUSÃO ATUALIZADA ***
  const excluirTransacao = async () => {
    if (!transactionToDelete) return; // Segurança

    const id = transactionToDelete.id;
    const token = localStorage.getItem('token');
    const toastId = toast.loading('Excluindo...');
    setIsSubmitting(true);
    try {
      const resposta = await fetch(`http://localhost:3001/usuario/dashboard/extratos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!resposta.ok) throw new Error('Erro ao excluir.');
      setTransacoes(prev => prev.filter(t => t.id !== id));
      toast.success('Excluído com sucesso!', { id: toastId });
    } catch (error) {
      toast.error(`Erro: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      fecharModalConfirmacaoDelete(); // Fecha o modal após a operação
    }
  };

  const abrirModalEdicao = (transacao) => {
    setEditTransacao({ ...transacao, valor: String(transacao.valor).replace('.', ',') });
  };
  const fecharModalEdicao = () => setEditTransacao(null);
  
  // *** NOVAS FUNÇÕES PARA CONTROLAR O MODAL DE DELETE ***
  const abrirModalConfirmacaoDelete = (transacao) => {
    setTransactionToDelete(transacao);
  };
  const fecharModalConfirmacaoDelete = () => {
    setTransactionToDelete(null);
  };
  
  const formatCurrency = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const transacoesAgrupadas = useMemo(() => {
    const filtradas = transacoes
      .filter(t => filter === 'all' || t.tipo === filter)
      .filter(t => t.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    return filtradas.reduce((acc, t) => {
      const data = new Date(t.data);
      const hoje = new Date();
      const ontem = new Date();
      ontem.setDate(hoje.getDate() - 1);
      
      let grupo = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      grupo = grupo.charAt(0).toUpperCase() + grupo.slice(1);

      if (data.toDateString() === hoje.toDateString()) grupo = 'Hoje';
      if (data.toDateString() === ontem.toDateString()) grupo = 'Ontem';

      if (!acc[grupo]) acc[grupo] = [];
      acc[grupo].push(t);
      return acc;
    }, {});
  }, [transacoes, filter, searchTerm]);

// =================================================================================
// RENDERIZAÇÃO MELHORADA
// =================================================================================

  return (
    <div className="flex font-sans bg-slate-950 text-slate-100 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(249,115,22,0.15),_transparent_30%)]" />
      <Toaster position="bottom-right" toastOptions={{
        className: "bg-slate-800 border border-slate-700 text-white",
        success: { iconTheme: { primary: '#34d399', secondary: '#1e293b' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#1e293b' } },
        loading: { iconTheme: { primary: '#f97316', secondary: '#1e293b' } },
      }}/>
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header usuario={usuario} />
        
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">Gerenciador de Transações</h1>
              <p className="text-slate-400 mt-1">Adicione, edite e visualize todas as suas movimentações financeiras.</p>
            </header>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/80 mb-6">
              <div className="flex items-center gap-2">
                <button onClick={() => setFilter('all')} className={clsx("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", filter === 'all' ? "bg-orange-600 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700")}>Todos</button>
                <button onClick={() => setFilter('entrada')} className={clsx("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", filter === 'entrada' ? "bg-green-600/50 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700")}>Entradas</button>
                <button onClick={() => setFilter('saida')} className={clsx("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", filter === 'saida' ? "bg-red-600/50 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700")}>Saídas</button>
              </div>
              <div className="relative w-full sm:w-auto"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Buscar transação..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <motion.button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/40 transition-shadow" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><FiPlus />Nova Transação</motion.button>
            </div>

            <AnimatePresence>
              {showForm && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <form onSubmit={handleFormSubmit} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/80 mb-6 overflow-hidden">
                          <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-orange-400">Adicionar Nova Transação</h3><button type="button" onClick={() => setShowForm(false)} className="p-1 text-slate-400 hover:text-white"><FiX /></button></div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2"><label htmlFor="nome" className="text-sm font-medium text-slate-400 mb-1 block">Nome</label><input type="text" id="nome" name="nome" required placeholder="Ex: Salário" className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none" /></div>
                              <div><label htmlFor="tipo" className="text-sm font-medium text-slate-400 mb-1 block">Tipo</label><div className="relative"><select name="tipo" id="tipo" defaultValue="saida" className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none pr-10"><option value="saida" className="bg-slate-800">Saída (Despesa)</option><option value="entrada" className="bg-slate-800">Entrada (Receita)</option></select><FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div></div>
                              <div><label htmlFor="valor" className="text-sm font-medium text-slate-400 mb-1 block">Valor (R$)</label><input type="text" name="valor" id="valor" inputMode="decimal" placeholder="0,00" required className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none" /></div>
                              <div className="md:col-span-2"><label htmlFor="descricao" className="text-sm font-medium text-slate-400 mb-1 block">Descrição</label><textarea name="descricao" id="descricao" rows="2" className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none" /></div>
                          </div>
                          <div className="flex justify-end mt-6"><motion.button type="submit" disabled={isSubmitting} className="font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg disabled:opacity-50" whileTap={{ scale: 0.95 }}>{isSubmitting ? <FiLoader className="animate-spin" /> : 'Adicionar'}</motion.button></div>
                      </form>
                  </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {isLoadingData ? (
                <div className="text-center py-16"><FiLoader className="animate-spin text-orange-500 mx-auto" size={48}/></div>
              ) : Object.keys(transacoesAgrupadas).length > 0 ? (
                Object.entries(transacoesAgrupadas).map(([grupo, items]) => (
                  <section key={grupo} className="mb-8">
                    <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider pb-2 border-b border-slate-700 mb-4">{grupo}</h2>
                    <ul className="space-y-3">
                      <AnimatePresence>
                        {items.map(t => (
                          <motion.li key={t.id} layout variants={itemVariants} exit={{ opacity: 0, x: -30 }} className="group relative p-[2px] rounded-xl bg-slate-800/50"><div className="flex items-center justify-between p-4 rounded-[10px] bg-slate-900"><div className="flex items-center gap-4"><div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", t.tipo === 'entrada' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>{t.tipo === 'entrada' ? <FiTrendingUp /> : <FiTrendingDown />}</div><div><p className="font-semibold text-slate-100">{t.nome}</p><p className="text-xs text-slate-400">{new Date(t.data).toLocaleDateString('pt-BR')}</p></div></div><div className="flex items-center gap-6"><p className={clsx("font-bold text-lg", t.tipo === 'entrada' ? "text-green-400" : "text-red-400")}>{formatCurrency(t.valor)}</p><div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button disabled={isSubmitting} onClick={() => abrirModalEdicao(t)} className="p-2 text-slate-400 hover:text-orange-400"><FiEdit2 /></button><button disabled={isSubmitting} onClick={() => abrirModalConfirmacaoDelete(t)} className="p-2 text-slate-400 hover:text-red-400"><FiTrash2 /></button></div></div></div><div className="absolute inset-0 rounded-xl bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#1e293b_50%,#f97316_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" /></motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </section>
                ))
              ) : (
                <div className="text-center py-16 text-slate-500"><FiArchive size={48} className="mx-auto mb-4" /><p>Nenhuma transação encontrada.</p><p>Tente ajustar seus filtros ou adicione uma nova transação.</p></div>
              )}
            </motion.div>
          </div>
        </div>
        <Footer />
      </main>

      {/* MODAL DE EDIÇÃO */}
      <AnimatePresence>
        {editTransacao && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[50] p-4" onClick={fecharModalEdicao}>
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 p-6">
              <form onSubmit={(e) => handleFormSubmit(e, true)}>
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-orange-400">Editar Transação</h3><button type="button" onClick={fecharModalEdicao} className="p-1 text-slate-400 hover:text-white"><FiX /></button></div>
                <div className="space-y-4">
                  <div><label htmlFor="nomeEdit" className="text-sm font-medium text-slate-400 mb-1 block">Nome</label><input type="text" id="nomeEdit" name="nome" required defaultValue={editTransacao.nome} className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none" /></div>
                  <div><label htmlFor="tipoEdit" className="text-sm font-medium text-slate-400 mb-1 block">Tipo</label><div className="relative"><select name="tipo" id="tipoEdit" defaultValue={editTransacao.tipo} className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none pr-10"><option value="saida" className="bg-slate-800">Saída (Despesa)</option><option value="entrada" className="bg-slate-800">Entrada (Receita)</option></select><FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div></div>
                  <div><label htmlFor="valorEdit" className="text-sm font-medium text-slate-400 mb-1 block">Valor (R$)</label><input type="text" name="valor" id="valorEdit" inputMode="decimal" required defaultValue={editTransacao.valor} className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none" /></div>
                  <div><label htmlFor="descricaoEdit" className="text-sm font-medium text-slate-400 mb-1 block">Descrição</label><textarea name="descricao" id="descricaoEdit" rows="2" defaultValue={editTransacao.descricao} className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none" /></div>
                </div>
                <div className="flex justify-end gap-4 mt-6"><button type="button" onClick={fecharModalEdicao} className="font-semibold py-2 px-5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200">Cancelar</button><motion.button type="submit" disabled={isSubmitting} className="font-semibold py-2 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg disabled:opacity-50" whileTap={{ scale: 0.95 }}>{isSubmitting ? <FiLoader className="animate-spin" /> : 'Salvar'}</motion.button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* *** NOVO MODAL DE CONFIRMAÇÃO DE DELETE *** */}
      <AnimatePresence>
        {transactionToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[50] p-4" onClick={fecharModalConfirmacaoDelete}>
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 p-6 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Confirmar Exclusão</h3>
              <p className="text-slate-400 mb-6">
                Tem certeza que deseja excluir a transação "{transactionToDelete.nome}"? <br/> A ação é irreversível.
              </p>
              <div className="flex justify-center gap-4">
                <button type="button" onClick={fecharModalConfirmacaoDelete} className="font-semibold py-3 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 w-full">Cancelar</button>
                <motion.button type="button" onClick={excluirTransacao} disabled={isSubmitting} className="font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg disabled:opacity-50 w-full" whileTap={{ scale: 0.95 }}>
                    {isSubmitting ? <FiLoader className="animate-spin mx-auto" /> : 'Excluir'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}