// /app/dashboard/config/page.jsx (VERSÃO FINAL - FOCO TOTAL NA FUNCIONALIDADE)
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation.js';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import validator from 'validator';
import { FiUser, FiMail, FiLock, FiKey, FiLoader, FiSave } from 'react-icons/fi';

// Componentes
import Sidebar from '../../components/DashBoard/Sidebar.jsx';
import Header from '../../components/DashBoard/Header.jsx';
import Footer from '../../components/DashBoard/Footer.jsx';
import SettingsSkeleton from '../../components/Settings/SettingsSkeleton.js'; // Mantemos o skeleton

const inputBase = "w-full px-4 py-3 pl-12 bg-slate-800/60 text-slate-100 rounded-xl border border-slate-700/80 placeholder-slate-500 transition-all duration-300 ease-in-out shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-500";
const buttonPrimary = "font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

export default function Config() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha_atual: '', // Campo CRÍTICO para autorização
    nova_senha: '',
    confirma_senha: ''
  });

  // Carrega os dados do usuário
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3001/usuario/autenticado', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('Falha na autenticação');
        const data = await res.json();
        setUsuario(data);
        // Popula o formulário com os dados iniciais
        setFormData(prev => ({ ...prev, nome: data.nome, email: data.email }));
      } catch (err) {
        toast.error('Sessão expirada. Redirecionando...');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Verificando e salvando...");

    // Validações Front-end Essenciais
    if (!formData.senha_atual) {
      toast.error("Você precisa digitar sua senha atual para salvar qualquer alteração.", { id: toastId });
      setIsSubmitting(false);
      return;
    }
    if (!validator.isEmail(formData.email)) {
      toast.error("Formato de e-mail inválido.", { id: toastId });
      setIsSubmitting(false);
      return;
    }
    if (formData.nova_senha && formData.nova_senha.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres.", { id: toastId });
      setIsSubmitting(false);
      return;
    }
    if (formData.nova_senha !== formData.confirma_senha) {
      toast.error("As novas senhas não coincidem.", { id: toastId });
      setIsSubmitting(false);
      return;
    }

    // Prepara os dados para enviar
    const dadosParaEnviar = {
        nome: formData.nome,
        email: formData.email,
        senha_atual: formData.senha_atual,
    };
    if (formData.nova_senha) {
          dadosParaEnviar.senha = formData.nova_senha; 
      }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/usuario/dashboard/config/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await res.json();
      
      if (!res.ok) {
        const errorMessage = data.err || "Ocorreu um erro descohecido";
        throw new Error(errorMessage);
      }

      toast.success("Alterações salvas com sucesso!", { id: toastId });
      setUsuario(prev => ({ ...prev, nome: formData.nome, email: formData.email }));
      // Limpa os campos de senha por segurança após o sucesso
      setFormData(prev => ({...prev, senha_atual: '', nova_senha: '', confirma_senha: ''}));

    } catch (err) {
      toast.error(err.message, { id: toastId });

    } finally {
      
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex font-sans min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="p-4 sm:p-6 lg:p-8 flex-1"><SettingsSkeleton /></div>
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className="flex font-sans bg-slate-950 text-slate-100 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(249,115,22,0.15),_transparent_30%)]" />
      <Toaster position="bottom-right" toastOptions={{ className: "bg-slate-800 border border-slate-700 text-white" }} />
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header usuario={usuario} />
        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex items-center justify-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl"
          >
            <form onSubmit={handleSubmit} className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700/80 space-y-6">
              <header className="text-center">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">Configurações da Conta</h1>
                <p className="text-slate-400 mt-1">Altere seus dados e senha com segurança.</p>
              </header>

              <div className="border-t border-slate-700 pt-6 space-y-4">
                <h2 className="text-lg font-semibold text-orange-400">Informações Pessoais</h2>
                <div>
                  <label htmlFor="nome" className="block text-sm text-slate-400 mb-1">Nome</label>
                  <div className="relative"><FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" name="nome" value={formData.nome} onChange={handleChange} className={inputBase} /></div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-slate-400 mb-1">E-mail</label>
                  <div className="relative"><FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputBase} /></div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 space-y-4">
                <h2 className="text-lg font-semibold text-orange-400">Alterar Senha</h2>
                <div>
                  <label htmlFor="nova_senha" className="block text-sm text-slate-400 mb-1">Nova Senha (deixe em branco para não alterar)</label>
                  <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="password" name="nova_senha" value={formData.nova_senha} onChange={handleChange} className={inputBase} placeholder="••••••••" /></div>
                </div>
                 <div>
                  <label htmlFor="confirma_senha" className="block text-sm text-slate-400 mb-1">Confirmar Nova Senha</label>
                  <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="password" name="confirma_senha" value={formData.confirma_senha} onChange={handleChange} className={inputBase} placeholder="••••••••" /></div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 space-y-4">
                <h2 className="text-lg font-bold text-red-400">Confirmação de Segurança</h2>
                 <div>
                  <label htmlFor="senha_atual" className="block text-sm text-slate-400 mb-1">Digite sua Senha ATUAL para salvar</label>
                  <div className="relative"><FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="password" name="senha_atual" value={formData.senha_atual} onChange={handleChange} required className={inputBase} placeholder="Sua senha atual é obrigatória" /></div>
                </div>
              </div>

              <div className="pt-6">
                <motion.button type="submit" disabled={isSubmitting} className={buttonPrimary + " w-full"} whileTap={{ scale: 0.98 }}>
                  {isSubmitting ? <FiLoader className="animate-spin" /> : <FiSave />}
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
        <Footer />
      </main>
    </div>
  );
}