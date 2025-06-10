// /app/components/Goals/GoalCard.jsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiMoreVertical, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import GoalChart from './GoalChart'; // O componente do gráfico que você já tem

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};  

export default function GoalCard({ meta, onEdit, onDelete, onInvest, onWithdraw, isSubmitting }) {

  if (meta.id === 1) { // <-- MUDE PARA O ID DA META QUE VOCÊ ESTÁ TESTANDO
    console.log(`%c[PASSO 3] GoalCard ID ${meta.id} recebeu props. Progresso:`, "color: yellow;", meta.progresso);
}
  // --- LÓGICA DO MENU DE AÇÕES ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Efeito para fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // --- FIM DA LÓGICA DO MENU ---

  // Dados já vêm calculados do `useMemo` na página principal
  const valorAtualFormatado = meta.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const valorLimiteFormatado = parseFloat(meta.valorDaMeta).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <motion.div variants={cardVariants} className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-lg p-6 flex flex-col h-full text-center">
      {/* Informações da Meta */}
      <h3 className="font-bold text-xl text-slate-100">{meta.nome}</h3>
      <span className="text-xs font-mono text-slate-400 mb-4">{`${String(meta.mes).padStart(2, '0')}/${meta.ano}`}</span>
      
      {/* Gráfico de Rosca */}
      <div className="my-4">
        <GoalChart progress={meta.progresso} />
      </div>

      {/* Exibição dos Valores */}
      <div className="flex justify-between text-sm text-slate-400 mb-6 w-full">
        <div className="text-left">
          <p className="font-semibold text-green-400">Investido</p>
          <span className="text-lg font-bold text-slate-100">{valorAtualFormatado}</span>
        </div>
        <div className="text-right">
          <p className="font-semibold">Meta</p>
          <span className="text-lg font-bold text-slate-100">{valorLimiteFormatado}</span>
        </div>
      </div>

      {/* --- SEÇÃO DE AÇÕES FINAL E CORRETA --- */}
      <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-center gap-2">
        <button
          onClick={onEdit}
          disabled={isSubmitting}
          className="p-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
          title="Editar Meta"
        ><FiEdit size={16} /></button>
        
        <button
          onClick={onDelete}
          disabled={isSubmitting}
          className="p-2 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors disabled:opacity-50"
          title="Excluir Meta"
        ><FiTrash2 size={16} /></button>

        {/* O MENU QUE ESTAVA FALTANDO */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={isSubmitting}
            className="p-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
            title="Mais Ações"
          >
            <FiMoreVertical size={18} />
          </button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 origin-bottom-right text-left"
              >
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => { onInvest(); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-orange-500/20 transition-colors"
                    >
                      <FiTrendingUp className="text-green-400" /> Investir
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { onWithdraw(); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-orange-500/20 transition-colors"
                    >
                      <FiTrendingDown className="text-red-400" /> Retirar
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}