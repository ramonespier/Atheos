// components/DashBoard/BalanceHistoryChart.js
"use client";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function BalanceHistoryChart({ historyData }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#cbd5e1' } },
      title: { display: true, text: 'Evolução Financeira (Últimos 6 Meses)', color: '#f1f5f9', font: { size: 16 } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  const data = {
    labels: historyData.labels,
    datasets: [
      {
        label: 'Receitas',
        data: historyData.receitas,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#34d399',
      },
      {
        label: 'Despesas',
        data: historyData.despesas,
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#f87171',
      }
    ],
  };

  return (
    <div className="relative p-[2px] rounded-2xl bg-white/5 h-[400px]">
      <div className="bg-slate-950 p-6 rounded-[14px] h-full">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}