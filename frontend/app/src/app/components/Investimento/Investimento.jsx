// /app/components/Goals/InvestmentModal.jsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrendingUp, FiTrendingDown, FiLoader } from 'react-icons/fi';

export default function InvestmentModal({ isOpen, type, onClose, onSubmit, isSubmitting }) {
  const [valor, setValor] = useState('');

  // Limpa o campo de valor sempre que o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      setValor('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(valor);
  };

  const isInvest = type === 'investir';
  const title = isInvest ? 'Realizar Investimento' : 'Realizar Retirada';
  const buttonText = isInvest ? 'Investir Valor' : 'Retirar Valor';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                {isInvest ? <FiTrendingUp className="text-green-400" /> : <FiTrendingDown className="text-red-400" />}
                {title}
              </h2>
              <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="valor-operacao" className="block text-sm font-medium text-slate-300 mb-2">
                  Valor da Operação
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R$</span>
                  <input
                    id="valor-operacao"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    required
                    autoFocus
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !valor}
                  className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2
                    ${isInvest ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? <FiLoader className="animate-spin" /> : buttonText}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}