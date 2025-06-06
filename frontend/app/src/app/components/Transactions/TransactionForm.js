// components/Transactions/TransactionForm.js
"use client";
import { motion } from 'framer-motion';
import { FiLoader, FiChevronDown, FiX } from 'react-icons/fi';

const inputBaseStyle = `w-full px-4 py-3 bg-slate-800 text-slate-100 rounded-xl border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500`;
const primaryBtnStyle = `font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed`;

export default function TransactionForm({
  onSubmit,
  isSubmitting,
  onClose,
  initialData = { nome: '', tipo: 'saida', valor: '', descricao: '' },
  isEdit = false,
}) {
  return (
    <motion.form
      layout
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onSubmit={onSubmit}
      className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/80 mb-6 overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-orange-400">{isEdit ? 'Editar Transação' : 'Adicionar Nova Transação'}</h3>
        {!isEdit && (
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white"><FiX /></button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="nome" className="text-sm font-medium text-slate-400 mb-1 block">Nome</label>
          <input type="text" id="nome" name="nome" required placeholder="Ex: Salário" defaultValue={initialData.nome} className={inputBaseStyle} />
        </div>
        <div>
          <label htmlFor="tipo" className="text-sm font-medium text-slate-400 mb-1 block">Tipo</label>
          <div className="relative">
            <select name="tipo" id="tipo" defaultValue={initialData.tipo} className={`${inputBaseStyle} appearance-none pr-10`}>
              <option value="saida" className="bg-slate-800">Saída (Despesa)</option>
              <option value="entrada" className="bg-slate-800">Entrada (Receita)</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label htmlFor="valor" className="text-sm font-medium text-slate-400 mb-1 block">Valor (R$)</label>
          <input type="text" name="valor" id="valor" inputMode="decimal" placeholder="0,00" required defaultValue={initialData.valor} className={inputBaseStyle} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="descricao" className="text-sm font-medium text-slate-400 mb-1 block">Descrição</label>
          <textarea name="descricao" id="descricao" rows="2" maxLength={250} defaultValue={initialData.descricao} className={`${inputBaseStyle} min-h-[60px]`} placeholder="Opcional..." />
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <motion.button type="submit" disabled={isSubmitting} className={primaryBtnStyle} whileTap={{ scale: 0.95 }}>
          {isSubmitting ? <FiLoader className="animate-spin" /> : (isEdit ? 'Salvar' : 'Adicionar')}
        </motion.button>
      </div>
    </motion.form>
  );
}