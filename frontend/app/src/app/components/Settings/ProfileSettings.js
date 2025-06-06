// components/Settings/ProfileSettings.js
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import validator from 'validator';

const inputBase = "w-full px-4 py-3 bg-slate-800/60 text-slate-100 rounded-xl border border-slate-700/80 placeholder-slate-500 transition-all duration-300 ease-in-out shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-500";

export default function ProfileSettings({ usuario, onUpdate }) {
  const [formData, setFormData] = useState({ nome: usuario.nome, email: usuario.email });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nome === usuario.nome && formData.email === usuario.email) {
      return toast.error("Nenhuma alteração detectada.");
    }
    if (!validator.isEmail(formData.email)) {
      return toast.error("Por favor, insira um e-mail válido.");
    }
    setIsSubmitting(true);
    await onUpdate({ nome: formData.nome, email: formData.email });
    setIsSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-slate-400 mb-1">Nome Completo</label>
          <div className="relative"><FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} className={`${inputBase} pl-12`} /></div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Endereço de E-mail</label>
          <div className="relative"><FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`${inputBase} pl-12`} /></div>
        </div>
        <div className="flex justify-end pt-4">
          <motion.button type="submit" disabled={isSubmitting} className="font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg disabled:opacity-50" whileTap={{ scale: 0.95 }}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}