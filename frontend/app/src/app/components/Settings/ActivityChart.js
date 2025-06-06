// components/Settings/ActivityChart.js
"use client";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function ActivityChart() {
  // Mock data - em um app real, viria do backend
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const data = {
    labels,
    datasets: [{
      label: 'Logins na Plataforma',
      data: labels.map(() => Math.floor(Math.random() * 30) + 5), // Dados aleatórios
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.8)');
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0.5)');
        return gradient;
      },
      borderColor: 'rgba(249, 115, 22, 1)',
      borderRadius: 6,
      borderWidth: 2,
    }],
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
    }
  };

  return (
    <div className="h-64"><Bar options={options} data={data} /></div>
  );
}