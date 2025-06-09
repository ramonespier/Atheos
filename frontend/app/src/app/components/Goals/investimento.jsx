// /app/components/Goals/InvestmentModal.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function InvestmentoModal({ meta, type, saldoDisponivel, onClose, onSubmit, isSubmitting }) {
  const [valor, setValor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valor || parseFloat(valor) <= 0) {
      alert('Por favor, insira um valor válido.');
      return;
    }
    // No caso de investir, verifica se o saldo é suficiente
    if (type === 'investir' && parseFloat(valor) > saldoDisponivel) {
      alert('Saldo insuficiente para este investimento.');
      return;
    }
    // No caso de retirar, verifica se o valor na meta é suficiente
    if (type === 'retirar' && parseFloat(valor) > meta.valorAtual) {
      alert('Você não pode retirar mais do que o valor investido na meta.');
      return;
    }
    onSubmit(valor);
  };

  const title = type === 'investir' ? 'Investir na Meta' : 'Retirar da Meta';
  const description = type === 'investir' 
    ? `Quanto você deseja depositar na meta "${meta.nome}"?`
    : `Quanto você deseja retirar da meta "${meta.nome}"?`;
  
  const saldoInfo = type === 'investir'
    ? `Saldo disponível em conta: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoDisponivel)}`
    : `Valor investido na meta: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(meta.valorAtual)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-900 border border-slate-700 rounded-xl p-8 w-full max-w-md"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 mb-6">{description}</p>
        
        <form onSubmit={handleSubmit}>
            <label htmlFor="valor-investimento" className="block text-sm font-medium text-slate-300 mb-2">
                Valor
            </label>
            <input
                type="number"
                id="valor-investimento"
                name="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                step="0.01"
                required
                autoFocus
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-slate-500 mt-2">{saldoInfo}</p>

            <div className="mt-8 flex justify-end">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-wait transition-transform"
                >
                    {isSubmitting ? 'Processando...' : 'Confirmar'}
                </button>
            </div>
        </form>
      </motion.div>
    </motion.div>
  );
}