// components/DashBoard/MonthlySummaryChart.js (CORRIGIDO)
"use client";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

// Plugin para desenhar o texto no centro do gráfico
const TextCenterPlugin = {
  id: 'textCenter',
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const { ctx, data } = chart;
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
    ctx.save();
    const x = chart.getDatasetMeta(0).data[0].x;
    const y = chart.getDatasetMeta(0).data[0].y;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#f1f5f9'; // slate-100
    ctx.fillText(total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}), x, y - 10);
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.fillText('Total Movimentado', x, y + 15);
  }
};

export default function MonthlySummaryChart({ receitas, despesas }) {
  // ** AQUI ESTAVA O ERRO - AGORA PREENCHIDO CORRETAMENTE **
  const data = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        label: 'Resumo do Mês',
        data: [receitas, despesas],
        backgroundColor: [
          'rgba(52, 211, 153, 0.7)', // green-400 com opacidade
          'rgba(248, 113, 113, 0.7)', // red-400 com opacidade
        ],
        borderColor: [
          '#1f2937', // Cor do fundo para um efeito "flutuante"
          '#1f2937',
        ],
        borderWidth: 4,
        hoverOffset: 15,
        hoverBorderColor: '#f97316', // Laranja no hover
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    animation: {
      animateScale: true,
      animateRotate: true
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#cbd5e1', // slate-300
          font: {
            size: 14,
            family: 'inherit',
          },
          padding: 20,
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1e293b', // slate-800
        titleColor: '#f97316', // orange-500
        bodyColor: '#e2e8f0', // slate-200
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <motion.div className="relative p-[2px] rounded-2xl bg-white/5 h-full">
      <div className="bg-slate-950 p-6 rounded-[14px] h-full flex flex-col">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex-shrink-0">Balanço Mensal</h3>
        <div className="relative flex-grow min-h-0">
          <Doughnut data={data} options={options} plugins={[TextCenterPlugin]} />
        </div>
      </div>
    </motion.div>
  );
}