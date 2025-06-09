// components/Goals/GoalForm.jsx
"use client";
import { motion } from 'framer-motion';
import { FiLoader, FiX, FiChevronDown } from 'react-icons/fi';

const inputBase = "w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none";
const buttonPrimary = "font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg disabled:opacity-50";

export default function GoalForm({ onSubmit, isSubmitting, onClose, initialData, isEdit = false }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('pt-BR', { month: 'long' })
  }));

  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
      <form onSubmit={onSubmit} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/80 mb-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-orange-400">{isEdit ? 'Editar Meta' : 'Criar Nova Meta'}</h3>
          {!isEdit && <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white"><FiX /></button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="nome" className="text-sm text-slate-400 mb-1 block">Nome da Meta</label>
            <input type="text" id="nome" name="nome" required defaultValue={initialData?.nome} placeholder="Ex: Gastos com Lazer" className={inputBase} />
          </div>
          <div>
            <label htmlFor="valorDaMeta" className="text-sm text-slate-400 mb-1 block">Valor Limite (R$)</label>
            <input type="text" id="valorDaMeta" name="valorDaMeta" inputMode="decimal" required defaultValue={initialData?.valorDaMeta?.replace('.', ',')} placeholder="Ex: 500,00" className={inputBase} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="mes" className="text-sm text-slate-400 mb-1 block">Mês</label>
              <div className="relative">
                <select name="mes" id="mes" required defaultValue={initialData?.mes} className={`${inputBase} appearance-none pr-10`}>
                  {months.map(m => <option key={m.value} value={m.value} className="bg-slate-800">{m.label}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="ano" className="text-sm text-slate-400 mb-1 block">Ano</label>
              <div className="relative">
                <select name="ano" id="ano" required defaultValue={initialData?.ano} className={`${inputBase} appearance-none pr-10`}>
                  {years.map(y => <option key={y} value={y} className="bg-slate-800">{y}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <motion.button type="submit" disabled={isSubmitting} className={buttonPrimary} whileTap={{ scale: 0.95 }}>
            {isSubmitting ? <FiLoader className="animate-spin" /> : (isEdit ? 'Salvar' : 'Criar Meta')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}