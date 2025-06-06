// components/Settings/SecuritySettings.js
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const inputBase = "w-full px-4 py-3 bg-slate-800/60 text-slate-100 rounded-xl border border-slate-700/80 placeholder-slate-500 transition-all duration-300 ease-in-out shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-500";

export default function SecuritySettings({ onUpdatePassword }) {
  const [passwords, setPasswords] = useState({ senhaAtual: '', novaSenha: '', confirmaSenha: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.novaSenha.length < 6) return toast.error("A nova senha deve ter no mínimo 6 caracteres.");
    if (passwords.novaSenha !== passwords.confirmaSenha) return toast.error("As novas senhas não coincidem.");
    
    setIsSubmitting(true);
    const success = await onUpdatePassword({ senha: passwords.novaSenha });
    if (success) setPasswords({ senhaAtual: '', novaSenha: '', confirmaSenha: '' });
    setIsSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="text-lg font-semibold text-slate-300 mb-4">Alterar Senha</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="novaSenha" className="block text-sm font-medium text-slate-400 mb-1">Nova Senha</label>
          <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="password" name="novaSenha" value={passwords.novaSenha} onChange={handleChange} className={`${inputBase} pl-12`} /></div>
        </div>
        <div>
          <label htmlFor="confirmaSenha" className="block text-sm font-medium text-slate-400 mb-1">Confirmar Nova Senha</label>
          <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="password" name="confirmaSenha" value={passwords.confirmaSenha} onChange={handleChange} className={`${inputBase} pl-12`} /></div>
        </div>
        <div className="flex justify-end pt-4">
          <motion.button type="submit" disabled={isSubmitting} className="font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg disabled:opacity-50" whileTap={{ scale: 0.95 }}>
            {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}