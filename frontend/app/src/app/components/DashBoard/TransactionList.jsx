// src/components/DashBoard/TransactionList.js
'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faExclamationTriangle, faSpinner, faListAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const formatCurrency = (value) => {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Variantes de animação podem ser mantidas ou simplificadas se necessário
const sectionVariants = {
  hidden: { opacity: 0, y: 15 }, // y um pouco menor
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeInOut", staggerChildren: 0.05 } // Stagger menor
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -15, height: 0 }, // x menor
  visible: { opacity: 1, x: 0, height: 'auto', transition: { type: "spring", stiffness: 130, damping: 18 } }, // Ajustes na mola
  exit: { opacity: 0, x: 15, height: 0, transition: { duration: 0.15 } } // Saída mais rápida
};

const descriptionVariants = {
  open: { opacity: 1, height: 'auto', marginTop: '0.3rem', transition: { duration: 0.25, ease: "circOut" } }, // Mais rápido
  closed: { opacity: 0, height: 0, marginTop: '0rem', transition: { duration: 0.15, ease: "circIn" } }
};

const MAX_ITEMS_DISPLAYED = 4; // Constante para o limite de itens

export default function TransactionList() {
  const [allTransferencias, setAllTransferencias] = useState([]); // Todas as transferências carregadas
  const [displayTransferencias, setDisplayTransferencias] = useState([]); // Transferências para exibir (limitado)
  const [erro, setErro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  // const [showAll, setShowAll] = useState(false); // Removido, vamos redirecionar

  useEffect(() => {
    const buscarTransferencias = async () => {
      setIsLoading(true);
      setErro(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setErro("Usuário não autenticado.");
        setIsLoading(false);
        return;
      }

      try {
        // Buscar todas as transferências, o backend pode ter um limite padrão, mas idealmente ordenamos aqui
        const resposta = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!resposta.ok) {
          const errorData = await resposta.json().catch(() => ({}));
          throw new Error(errorData.message || 'Erro ao carregar transferências');
        }

        const dadosTransferencias = await resposta.json();
        const sortedData = dadosTransferencias.sort((a,b) => new Date(b.createdAt || b.data || 0) - new Date(a.createdAt || a.data || 0));
        setAllTransferencias(sortedData);
        setDisplayTransferencias(sortedData.slice(0, MAX_ITEMS_DISPLAYED));

      } catch (error) {
        setErro(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    buscarTransferencias();
  }, []);

  function toggleExpand(idx) {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-slate-500 h-32"> {/* Altura reduzida */}
          <FontAwesomeIcon icon={faSpinner} className="fa-spin text-orange-500 mb-2" size="lg" /> {/* Tamanho do ícone menor */}
          Carregando...
        </div>
      );
    }

    if (erro) {
      return (
        <div className="bg-red-700/10 border border-red-600/30 text-red-400 p-3 rounded-md flex items-center gap-2 text-sm"> {/* Mais compacto */}
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>Erro: {erro}</span>
        </div>
      );
    }

    if (displayTransferencias.length === 0) {
      return (
        <div className="text-center text-slate-500 py-6 text-sm"> {/* Mais compacto */}
          <FontAwesomeIcon icon={faListAlt} size="2x" className="mb-2 text-slate-600" />
          <p>Nenhuma transação recente.</p>
        </div>
      );
    }

    return (
      <motion.ul 
        className="space-y-1.5" // Espaçamento menor entre itens
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence initial={false}>
          {displayTransferencias.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            const isPositive = item.tipo === 'entrada';
            const descriptionId = `desc-${idx}`;

            return (
              <motion.li
                key={item.id}
                variants={listItemVariants}
                layout
                className={`
                  rounded-md overflow-hidden {/* borda um pouco menos arredondada */}
                  border border-slate-700/50 
                  bg-slate-800/40 hover:bg-slate-800/70
                  transition-colors duration-150
                  ${isExpanded ? 'shadow-md shadow-orange-800/10 border-orange-600/40' : 'hover:border-slate-600/80'}
                `}
              >
                <button
                  className="w-full flex justify-between items-center p-2.5 sm:p-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-800 rounded-t-md text-sm" // Padding e texto menores
                  onClick={() => toggleExpand(idx)}
                  aria-expanded={isExpanded}
                  aria-controls={descriptionId}
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`w-3 h-3 text-slate-500 transition-transform duration-200 transform ${isExpanded ? 'rotate-180 text-orange-400' : ''}`}
                    />
                    <span className="font-medium text-slate-300 group-hover:text-orange-300 transition-colors truncate max-w-[120px] sm:max-w-[180px]" title={item.nome}> {/* Max-width menor */}
                      {item.nome}
                    </span>
                  </div>
                  <span className={`font-semibold text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}> {/* Texto do valor menor */}
                    {formatCurrency(item.valor)}
                  </span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={descriptionId}
                      variants={descriptionVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="px-3 pb-2 text-slate-400 text-xs" // Padding e texto menores
                    >
                      { (item.createdAt || item.data) &&
                        <p className="mb-0.5 text-xxs text-slate-500"> {/* texto bem pequeno para data */}
                          {new Date(item.createdAt || item.data).toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                        </p>
                      }
                      <p className="whitespace-pre-wrap break-words leading-snug"> {/* Leading menor */}
                        {item.descricao || "Sem descrição."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    );
  }

  return (
    <motion.section 
      className="bg-gradient-to-b from-slate-900/60 to-slate-950/80 backdrop-blur-md text-slate-200 p-4 sm:p-5 rounded-xl shadow-lg shadow-black/50 border border-slate-700/40 flex-1" // Padding e rounded menores
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-3 sm:mb-4"> {/* Margem inferior menor */}
        <h3 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500"> {/* Tamanho da fonte menor */}
          Últimas Transações
        </h3>
      </div>
      
      {renderContent()}

      {allTransferencias.length > MAX_ITEMS_DISPLAYED && (
        <div className="mt-3 text-center"> {/* Margem superior menor */}
          <Link href="/dashboard/extratos"className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 hover:underline transition-colors duration-150 font-medium py-1.5 px-3 rounded-md hover:bg-orange-500/10">
              Ver todas ({allTransferencias.length})
              <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3"/>
            
          </Link>
        </div>
      )}
    </motion.section>
  );
}