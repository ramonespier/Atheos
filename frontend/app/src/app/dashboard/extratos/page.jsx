"use client"
import { useEffect, useState } from "react";
import Sidebar from '../../components/DashBoard/Sidebar';
import Header from '../../components/DashBoard/Header';
import Footer from '../../components/DashBoard/Footer.jsx';
import { useRouter } from "next/navigation";
import {
  FiEdit2, FiTrash2, FiX, FiPlusCircle, FiLoader,
  FiAlertTriangle, FiCheckCircle, FiChevronDown, FiInfo
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast'; // Importação do react-hot-toast

// ... (suas variantes de animação e constantes de estilo base permanecem as mesmas) ...
const containerVariants = { /* ... */ };
const itemVariants = { /* ... */ };
const modalVariants = { /* ... */ };
const inputFocusEffect = "focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75 focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.5)]";
const baseInputStyle = `w-full px-4 py-3 bg-slate-800/60 backdrop-blur-sm text-slate-100 rounded-xl border border-slate-700/80 placeholder-slate-500 transition-all duration-300 ease-in-out shadow-inner focus:outline-none`;
const buttonBaseStyle = `font-semibold tracking-wider py-3 px-6 rounded-xl transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900`;
const primaryButtonStyle = `${buttonBaseStyle} bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`;
const secondaryButtonStyle = `${buttonBaseStyle} bg-slate-700/80 hover:bg-slate-600/90 text-slate-200 shadow-md hover:shadow-slate-600/30 active:scale-95`;


// Estilos customizados para os Toasts
const toastBaseStyle = "flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-lg border text-sm font-medium";
const successToastStyle = `${toastBaseStyle} bg-green-600/20 border-green-500/50 text-green-300`;
const errorToastStyle = `${toastBaseStyle} bg-red-600/20 border-red-500/50 text-red-300`;
const infoToastStyle = `${toastBaseStyle} bg-sky-600/20 border-sky-500/50 text-sky-300`;
const loadingToastStyle = `${toastBaseStyle} bg-slate-700/30 border-slate-600/50 text-slate-300`;


export default function Extratos() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({});
  const [transferencias, setTransferencias] = useState([]);
  const [globalError, setGlobalError] = useState(null); // Renomeado para clareza
  const [editTransferencia, setEditTransferencia] = useState(null);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false); // Para carregamento inicial de dados
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buscarTransferencias = async () => {
    const token = localStorage.getItem('token');
    setIsLoadingData(true);
    try {
      const resposta = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!resposta.ok) throw new Error('Falha ao carregar transferências.');
      const dadosTransferencias = await resposta.json();
      setTransferencias(dadosTransferencias.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      setGlobalError(null);
    } catch (error) {
      setGlobalError(error.message); // Erro global para falha no carregamento de dados
      toast.error(`Erro ao buscar dados: ${error.message}`, { className: errorToastStyle, icon: <FiAlertTriangle size={20} /> });
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
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!resposta.ok) throw new Error('Sessão expirada ou inválida. Faça login novamente.');
        const dadosUsuario = await resposta.json();
        setUsuario(dadosUsuario);
        await buscarTransferencias();
      } catch (error) {
        setGlobalError(error.message);
        if (error.message.toLowerCase().includes("expirada") || error.message.toLowerCase().includes("autenticado")) {
          toast(
            (t) => (
              <div className={`${infoToastStyle} justify-between w-full max-w-sm`}>
                <div className="flex items-center">
                  <FiInfo size={20} className="mr-2"/>
                  <span>{error.message} Redirecionando...</span>
                </div>
                <button onClick={() => toast.dismiss(t.id)} className="p-1 rounded-full hover:bg-sky-500/20">
                  <FiX size={18} />
                </button>
              </div>
            ),
            { duration: 4000 }
          );
          setTimeout(() => router.push('/login'), 2000);
        } else {
          toast.error(`Erro de autenticação: ${error.message}`, { className: errorToastStyle, icon: <FiAlertTriangle size={20} /> });
        }
      }
    };
    buscarUsuario();
  }, [router]);

  const validarValor = (valorStr) => {
    const valor = valorStr.replace(',', '.');
    if (valor.length > 10) {
      return { isValid: false, message: 'O valor não pode exceder 10 caracteres.' };
    }
    const partes = valor.split('.');
    if (partes.length > 1 && partes[1].length > 2) {
      return { isValid: false, message: 'Use no máximo 2 casas decimais para o valor.' };
    }
    const numValor = parseFloat(valor);
    if (isNaN(numValor) || numValor <= 0) { // Geralmente transferências devem ser > 0
        return { isValid: false, message: 'Valor inválido. Insira um número positivo maior que zero.' };
    }
    return { isValid: true, message: '' };
  };

  const handleFormSubmit = async (evento, method, url, isEdit = false) => {
    evento.preventDefault();
    const token = localStorage.getItem('token');
    setIsSubmitting(true);
    setGlobalError(null); // Limpa erro global ao tentar nova submissão

    const toastId = toast.loading(isEdit ? 'Salvando alterações...' : 'Adicionando transferência...', {
      className: loadingToastStyle,
      icon: <FiLoader className="animate-spin" size={20} />
    });

    try {
      const formData = new FormData(evento.target);
      const dados = Object.fromEntries(formData);
      
      const valorValidacao = validarValor(dados.valor.toString());
      if (!valorValidacao.isValid) {
        toast.error(valorValidacao.message, { id: toastId, className: errorToastStyle, icon: <FiAlertTriangle size={20} /> });
        setIsSubmitting(false);
        return;
      }
      dados.valor = parseFloat(dados.valor.toString().replace(',', '.'));

      const resposta = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) {
        const errorData = await resposta.json().catch(() => ({ message: `Erro ${resposta.status}` }));
        throw new Error(errorData.message || `Erro ao ${isEdit ? 'editar' : 'adicionar'} transferência.`);
      }

      await buscarTransferencias(); // Recarrega a lista
      toast.success(`${isEdit ? 'Transferência editada' : 'Transferência adicionada'} com sucesso!`, {
        id: toastId,
        className: successToastStyle,
        icon: <FiCheckCircle size={20} />,
      });
      if (!isEdit) evento.target.reset();
      if (isEdit) fecharModalEdicao();
    } catch (error) {
      toast.error(`Falha na operação: ${error.message}`, {
        id: toastId,
        className: errorToastStyle,
        icon: <FiAlertTriangle size={20} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const adicionarTransferencia = (e) => handleFormSubmit(e, 'POST', 'http://localhost:3001/usuario/dashboard/extratos');
  const editarTransferenciaSubmit = (e) => handleFormSubmit(e, 'PUT', `http://localhost:3001/usuario/dashboard/extratos/${editTransferencia.id}`, true);

  const excluirTransferencia = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta transferência? Esta ação é irreversível.")) return;

    const token = localStorage.getItem('token');
    setGlobalError(null);
    const toastId = toast.loading('Excluindo transferência...', {
      className: loadingToastStyle,
      icon: <FiLoader className="animate-spin" size={20} />
    });

    setIsSubmitting(true); // Usar isSubmitting para desabilitar outros botões se necessário
    try {
      const resposta = await fetch(`http://localhost:3001/usuario/dashboard/extratos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!resposta.ok) throw new Error('Erro ao excluir transferência.');
      setTransferencias(prev => prev.filter(transf => transf.id !== id));
      toast.success('Transferência excluída com sucesso!', {
        id: toastId,
        className: successToastStyle,
        icon: <FiCheckCircle size={20} />,
      });
    } catch (error) {
      toast.error(`Erro ao excluir: ${error.message}`, {
        id: toastId,
        className: errorToastStyle,
        icon: <FiAlertTriangle size={20} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const abrirModalEdicao = (transferencia) => {
    setEditTransferencia({ ...transferencia, valor: Number(transferencia.valor).toFixed(2).replace('.',',') }); // Formata para vírgula no modal
    setMostrarEditor(true);
    setGlobalError(null);
  };

  const fecharModalEdicao = () => {
    setEditTransferencia(null);
    setMostrarEditor(false);
    // Não limpar globalError aqui, pois pode ser um erro não relacionado ao modal
  };
  
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="flex font-sans bg-gradient-to-br from-slate-950 via-gray-900 to-black min-h-screen text-slate-100 selection:bg-orange-500 selection:text-white">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerClassName="mt-4 mr-4"
        toastOptions={{
          duration: 5000, // Duração padrão
          // Estilos e classes aqui seriam globais, mas estamos aplicando por tipo de toast
        }}
      />
      <Sidebar />

      <main className="flex-1 min-h-screen flex flex-col">
        <Header usuario={usuario} />
        
        <AnimatePresence>
          {globalError && !mostrarEditor && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md"
              role="alert"
            >
              <div className="bg-red-600/90 backdrop-blur-md text-white p-4 rounded-lg shadow-2xl flex items-center space-x-3 mx-4 sm:mx-0">
                <FiAlertTriangle size={24} className="flex-shrink-0"/>
                <span className="flex-grow">{globalError}</span>
                <button onClick={() => setGlobalError(null)} className="p-1 rounded-full hover:bg-red-700/50" aria-label="Fechar alerta">
                  <FiX size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="p-4 sm:p-8 space-y-8 flex-1"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Formulário de Nova Transferência */}
          <motion.form
            onSubmit={adicionarTransferencia}
            variants={itemVariants}
            className="bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-orange-900/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto border border-orange-600/30 shadow-2xl shadow-black/50"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-6 sm:mb-8 tracking-tight flex items-center">
              <FiPlusCircle className="mr-3 text-orange-500" size={28}/> Nova Transação Financeira
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2">
                <label htmlFor="nome" className="block text-orange-300/90 mb-2 text-sm font-medium tracking-wide">Destinatário / Origem:</label>
                <input type="text" id="nome" name="nome" required placeholder="Ex: Salário, Aluguel, Supermercado XPTO" className={`${baseInputStyle} ${inputFocusEffect}`} />
              </div>
              <div>
                <label htmlFor="tipo" className="block text-orange-300/90 mb-2 text-sm font-medium tracking-wide">Tipo:</label>
                <div className="relative">
                  <select name="tipo" id="tipo" className={`${baseInputStyle} ${inputFocusEffect} appearance-none pr-10`}>
                    <option value="entrada" className="bg-slate-800">Entrada (Receita)</option>
                    <option value="saida" className="bg-slate-800">Saída (Despesa)</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20}/>
                </div>
              </div>
              <div>
                <label htmlFor="valor" className="block text-orange-300/90 mb-2 text-sm font-medium tracking-wide">Valor (R$):</label>
                <input type="text" name="valor" id="valor" inputMode="decimal" placeholder="0,00" required className={`${baseInputStyle} ${inputFocusEffect}`} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="descricao" className="block text-orange-300/90 mb-2 text-sm font-medium tracking-wide">Descrição (Opcional):</label>
                <textarea name="descricao" id="descricao" rows="3" maxLength={250} className={`${baseInputStyle} ${inputFocusEffect} min-h-[80px]`} placeholder="Detalhes adicionais sobre a transação..."/>
              </div>
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-8 ${primaryButtonStyle}`}
              whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
            >
              {isSubmitting && !editTransferencia ? ( // Diferencia o texto do botão para edição
                <div className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2" size={20} />
                  Adicionando...
                </div>
              ) : (
                'Adicionar Transferência'
              )}
            </motion.button>
          </motion.form>

          {/* Lista de Transferências */}
          <motion.section 
            variants={itemVariants}
            className="mt-10 sm:mt-16 max-w-5xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 mb-6 sm:mb-8 tracking-tight">Meus Extratos Recentes</h2>

            {isLoadingData && transferencias.length === 0 && (
              <div className="flex flex-col items-center justify-center text-slate-400 h-40 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <FiLoader className="animate-spin text-orange-500 mb-3" size={32} />
                Carregando suas transações...
              </div>
            )}
            {!isLoadingData && transferencias.length === 0 && !globalError && ( // Adicionado !globalError para não mostrar msg de "nenhuma transferencia" se houver erro de carregamento
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-slate-400 py-10 bg-slate-800/30 rounded-xl border border-slate-700/50"
              >
                <FiInfo size={48} className="mx-auto mb-4 text-orange-500/70" /> {/* Trocado por FiInfo */}
                <p className="text-xl">Nenhuma transferência encontrada.</p>
                <p className="text-sm">Que tal adicionar sua primeira agora?</p>
              </motion.div>
            )}

            <AnimatePresence>
              {transferencias.length > 0 && (
                <motion.ul 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {transferencias.map((transf) => (
                    <motion.li
                      key={transf.id}
                      layout 
                      variants={itemVariants} 
                      initial="hidden" 
                      animate="visible"
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                      className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg border border-slate-700/60 hover:border-orange-500/50 transition-colors duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex-grow mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <span className={`mr-2 h-3 w-3 rounded-full ${transf.tipo === 'entrada' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <p className="text-slate-100 font-semibold text-lg truncate max-w-[200px] sm:max-w-[300px] md:max-w-md" title={transf.nome}>{transf.nome}</p>
                          </div>
                          <p className={`text-sm font-medium ${transf.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                            {transf.tipo === 'entrada' ? 'Receita' : 'Despesa'} de {formatCurrency(transf.valor)}
                          </p>
                          {transf.descricao && (
                            <p className="text-slate-400 text-xs mt-1 italic truncate max-w-[250px] sm:max-w-xs md:max-w-sm" title={transf.descricao}>{transf.descricao}</p>
                          )}
                           <p className="text-slate-500 text-xs mt-1">
                            {new Date(transf.createdAt || transf.data || Date.now()).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex space-x-3 items-center self-end sm:self-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            onClick={() => abrirModalEdicao(transf)}
                            className="text-orange-400 hover:text-orange-300 p-2 rounded-full hover:bg-slate-700/50 transition-all"
                            title="Editar"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={isSubmitting} // Desabilita durante outras submissões
                          >
                            <FiEdit2 size={18} />
                          </motion.button>
                          <motion.button
                            onClick={() => excluirTransferencia(transf.id)}
                            className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-slate-700/50 transition-all"
                            title="Excluir"
                            disabled={isSubmitting} // Desabilita durante outras submissões
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Modal de Edição */}
          <AnimatePresence>
            {mostrarEditor && editTransferencia && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
                onClick={fecharModalEdicao}
              >
                <motion.form
                  onSubmit={editarTransferenciaSubmit}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-8 rounded-2xl max-w-md w-full border border-orange-600/50 shadow-2xl shadow-black/70 relative"
                >
                  <button type="button" onClick={fecharModalEdicao} className="absolute top-4 right-4 text-slate-400 hover:text-orange-400 p-2 rounded-full hover:bg-slate-700/50 transition-all" aria-label="Fechar modal">
                    <FiX size={24}/>
                  </button>
                  <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-6 tracking-tight">
                    Editar Transação
                  </h2>
                  {/* Erro específico do Modal (opcional, já que o toast é usado) */}
                  {/* {globalError && mostrarEditor && ( ... ) } */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="nomeEdit" className="block text-orange-300/90 mb-1.5 text-sm font-medium">Destinatário / Origem:</label>
                      <input type="text" id="nomeEdit" name="nome" defaultValue={editTransferencia.nome} required className={`${baseInputStyle} ${inputFocusEffect}`} />
                    </div>
                    <div>
                      <label htmlFor="tipoEdit" className="block text-orange-300/90 mb-1.5 text-sm font-medium">Tipo:</label>
                       <div className="relative">
                        <select name="tipo" id="tipoEdit" defaultValue={editTransferencia.tipo} className={`${baseInputStyle} ${inputFocusEffect} appearance-none pr-10`}>
                          <option value="entrada" className="bg-slate-800">Entrada (Receita)</option>
                          <option value="saida" className="bg-slate-800">Saída (Despesa)</option>
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20}/>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="valorEdit" className="block text-orange-300/90 mb-1.5 text-sm font-medium">Valor (R$):</label>
                      <input type="text" name="valor" id="valorEdit" inputMode="decimal" defaultValue={editTransferencia.valor} required className={`${baseInputStyle} ${inputFocusEffect}`} />
                    </div>
                    <div>
                      <label htmlFor="descricaoEdit" className="block text-orange-300/90 mb-1.5 text-sm font-medium">Descrição:</label>
                      <textarea name="descricao" id="descricaoEdit" rows="3" maxLength={250} defaultValue={editTransferencia.descricao} className={`${baseInputStyle} ${inputFocusEffect} min-h-[70px]`}/>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-8">
                    <motion.button type="button" onClick={fecharModalEdicao} className={`${secondaryButtonStyle} px-5 py-2.5 text-sm`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      Cancelar
                    </motion.button>
                    <motion.button type="submit" disabled={isSubmitting} className={`${primaryButtonStyle} px-5 py-2.5 text-sm`} whileHover={{ scale: !isSubmitting ? 1.03 : 1 }} whileTap={{ scale: !isSubmitting ? 0.97 : 1 }}>
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <FiLoader className="animate-spin mr-2" size={18} />
                          Salvando...
                        </div>
                      ) : (
                        'Salvar Alterações'
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <Footer />
      </main>
    </div>
  );
}