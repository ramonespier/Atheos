// /app/components/Goals/DoughMeta.jsx

"use client";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiMinus, FiCalendar } from 'react-icons/fi';
import { useEffect  } from 'react';

// É crucial registrar os componentes do Chart.js que você irá usar.
ChartJS.register(ArcElement, Tooltip);

const DoughMeta = ({ meta, onEdit, onDelete, onInvest, onWithdraw, isSubmitting }) => {
  



  // --- 1. PREPARAÇÃO DOS DADOS VINDOS DO BD ---
  
  // Converte os valores decimais para números, garantindo que não quebre se forem nulos.
  const valorInvestido = parseFloat(meta.valorInvestido) || 0;
  const valorDaMeta = parseFloat(meta.valorDaMeta) || 1; // Usa 1 como fallback para evitar divisão por zero.

  // Calcula o progresso para o gráfico e o texto.
  const progressoPercentual = Math.min((valorInvestido / valorDaMeta) * 100, 100); // Garante que não passe de 100%
  const valorRestante = Math.max(valorDaMeta - valorInvestido, 0); // O que falta para a parte "vazia" do gráfico.

  // Formata o prazo (mês/ano) de forma amigável para o usuário.
  // new Date() espera o mês com base em zero (0=Jan), então subtraímos 1.
  const prazoFormatado = new Date(meta.ano, meta.mes - 1)
    .toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    .replace('.', '') // Remove o ponto (ex: 'set.' -> 'set')
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitaliza o mês (ex: 'set' -> 'Set')

  // --- 2. CONFIGURAÇÃO DO GRÁFICO ---
  
  const chartData = {
    datasets: [
      {
        data: [valorInvestido, valorRestante], // [Parte preenchida, Parte que falta]
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)', // Laranja vibrante para o progresso (cor do tema)
          'rgba(71, 85, 105, 0.3)', // Cinza/Slate para o que falta (fundo sutil)
        ],
        borderColor: 'rgba(2, 6, 23, 0)', // Cor do fundo da página para um efeito de recorte
        borderWidth: 2,
        cutout: '75%', // Controla o tamanho do "buraco" do donut
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        enabled: false, // Desabilitamos a tooltip padrão para usar nosso texto customizado no centro.
      },
    },
    animation: {
      animateRotate: true, // Garante a animação de rotação
      animateScale: true, // Garante a animação de escala
    },
  };

  // --- 3. RENDERIZAÇÃO DO COMPONENTE (JSX) ---
  
  return (
    <motion.div
      // Animação de entrada, aproveitando o Framer Motion já presente na página
      variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
      className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl"
    >
      {/* CABEÇALHO: Título, Prazo e Botões de Edição/Exclusão */}
      <header className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-100">{meta.nome}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-slate-400">
             <FiCalendar size={12} />
             <span className="text-xs font-medium">Prazo: {prazoFormatado}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <button onClick={onEdit} className="p-1 rounded-full hover:bg-slate-700 hover:text-white transition-colors"><FiEdit size={16} /></button>
          <button onClick={onDelete} className="p-1 rounded-full hover:bg-slate-700 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
        </div>
      </header>

      {/* ÁREA DO GRÁFICO: O Donut e o texto centralizado */}
      <div className="relative my-4 flex-grow flex items-center justify-center">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
            {progressoPercentual.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">
            {valorInvestido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
      
      {/* RODAPÉ: Botões de Investir e Retirar */}
      <footer className="mt-4">
         <div className="text-center mb-4">
            <p className="text-sm text-slate-400">
              Meta de {' '}
              <span className="font-semibold text-slate-300">
                {valorDaMeta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onWithdraw}
            disabled={isSubmitting || valorInvestido <= 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiMinus /> Retirar
          </button>
          <button
            onClick={onInvest}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md hover:shadow-orange-500/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus /> Investir
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

export default DoughMeta;