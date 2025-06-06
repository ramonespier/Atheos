// components/Goals/GoalCard.jsx
"use client";
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FiEdit2, FiTrash2, FiTarget } from 'react-icons/fi';

const formatCurrency = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function GoalCard({ meta, gastoAtual, onEdit, onDelete, isSubmitting }) {
  const progresso = meta.valor_limite > 0 ? (gastoAtual / meta.valor_limite) * 100 : 0;
  const restante = meta.valor_limite - gastoAtual;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative p-[2px] rounded-xl bg-slate-800/50"
    >
      <div className="flex flex-col justify-between p-4 rounded-[10px] bg-slate-900 h-full">
        <div>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <FiTarget className="w-6 h-6 text-orange-400" />
              <h3 className="font-semibold text-slate-100">{meta.nome}</h3>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button disabled={isSubmitting} onClick={() => onEdit(meta)} className="p-2 text-slate-400 hover:text-orange-400"><FiEdit2 size={16} /></button>
              <button disabled={isSubmitting} onClick={() => onDelete(meta.id)} className="p-2 text-slate-400 hover:text-red-400"><FiTrash2 size={16} /></button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(meta.ano, meta.mes - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400">{formatCurrency(gastoAtual)}</span>
            <span className="text-slate-400">/ {formatCurrency(meta.valor_limite)}</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5">
            <motion.div
              className={clsx(
                "h-2.5 rounded-full",
                progresso < 50 && "bg-green-500",
                progresso >= 50 && progresso < 80 && "bg-yellow-500",
                progresso >= 80 && "bg-red-500"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progresso > 100 ? 100 : progresso}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-right mt-1 text-slate-500">
            {restante >= 0 ? `${formatCurrency(restante)} restante` : `${formatCurrency(Math.abs(restante))} acima`}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 rounded-xl bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#1e293b_50%,#f97316_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}