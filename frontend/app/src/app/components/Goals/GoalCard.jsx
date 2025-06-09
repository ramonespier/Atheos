"use client";
import { motion } from 'framer-motion';
// Adicionados ícones para as novas ações
import { FiEdit2, FiTrash2, FiTarget, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';

const formatCurrency = (value) => {
  // Garante que o valor é um número antes de formatar
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'R$ 0,00';
  }
  return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Props atualizadas: `gastoAtual` -> `valorAtual`, e adicionado `onInvest` e `onWithdraw`
export default function GoalCard({ meta, valorAtual, onEdit, onDelete, onInvest, onWithdraw, isSubmitting }) {
  
  // O progresso agora é calculado com base no valor investido (valorAtual)
  const progresso = valorAtual > 0 ? (valorAtual / meta.valor_limite) * 100 : 0;

  // Lógica corrigida para calcular quanto falta para atingir a meta
  const faltam = meta.valor_limite - valorAtual;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col p-[2px] rounded-xl bg-slate-800/50"
    >
      <div className="flex flex-col flex-1 justify-between p-4 rounded-[10px] bg-slate-900 h-full">
        {/* SEÇÃO DO CABEÇALHO (sem alterações de lógica) */}
        <div>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <FiTarget className="w-6 h-6 text-orange-400" />
              <h3 className="font-semibold text-slate-100">{meta.nome}</h3>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* onEdit agora passa o objeto meta inteiro, como na sua página principal */}
              <button disabled={isSubmitting} onClick={() => onEdit(meta)} className="p-2 text-slate-400 hover:text-orange-400"><FiEdit2 size={16} /></button>
              <button disabled={isSubmitting} onClick={() => onDelete(meta.id)} className="p-2 text-slate-400 hover:text-red-400"><FiTrash2 size={16} /></button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {/* Mantém a data de referência, se ainda for útil */}
            Meta para {new Date(meta.ano, meta.mes - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        {/* SEÇÃO DE VALORES E PROGRESSO (lógica atualizada) */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            {/* O valor exibido agora é o `valorAtual` investido */}
            <span className="font-semibold text-orange-400">{formatCurrency(valorAtual)}</span>
            <span className="text-slate-400">/ {formatCurrency(meta.valor_limite)}</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5">
            <motion.div
              // A cor da barra agora é consistente com o tema, pois progresso alto é algo bom.
              className="h-2.5 rounded-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${progresso > 100 ? 100 : progresso}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          {/* Texto de status mais intuitivo para uma meta de economia */}
          <p className="text-xs text-right mt-1 text-slate-500">
            {faltam > 0
              ? `${formatCurrency(faltam)} para atingir`
              : 'Meta alcançada! 🎉'}
          </p>
        </div>

        {/* NOVO: SEÇÃO DE BOTÕES DE AÇÃO */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onInvest}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlusCircle size={16} />
            Investir
          </button>
          <button
            onClick={onWithdraw}
            // Desabilitado se estiver submetendo ou se não houver saldo na meta
            disabled={isSubmitting || valorAtual <= 0}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/40 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiMinusCircle size={16} />
            Retirar
          </button>
        </div>
      </div>

      {/* EFEITO DE BORDA (sem alterações) */}
      <div className="absolute inset-0 rounded-xl bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#1e293b_50%,#f97316_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}