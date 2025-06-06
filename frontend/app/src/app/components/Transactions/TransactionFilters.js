// components/Transactions/TransactionFilters.js
"use client";
import { FiSearch, FiSliders, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function TransactionFilters({
  onAdd,
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
}) {
  const activeBtn = "bg-orange-600 text-white";
  const inactiveBtn = "bg-slate-700/50 text-slate-300 hover:bg-slate-700";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/80 mb-6">
      <div className="flex items-center gap-2">
        <button onClick={() => setFilter('all')} className={`${filter === 'all' ? activeBtn : inactiveBtn} px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}>Todos</button>
        <button onClick={() => setFilter('entrada')} className={`${filter === 'entrada' ? activeBtn : inactiveBtn} px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}>Entradas</button>
        <button onClick={() => setFilter('saida')} className={`${filter === 'saida' ? activeBtn : inactiveBtn} px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}>Saídas</button>
      </div>

      <div className="relative w-full sm:w-auto">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar transação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      
      <motion.button
        onClick={onAdd}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/40 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiPlus />
        Nova Transação
      </motion.button>
    </div>
  );
}