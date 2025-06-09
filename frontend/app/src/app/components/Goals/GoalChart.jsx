// /app/components/Goals/GoalChart.jsx
"use client";

import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, DoughnutController);

export default function GoalChart({ progress = 0 }) {


    console.log(`%c[PASSO 4] GoalChart recebeu o progresso:`, "color: orange;", progress);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const ctx = chartRef.current.getContext('2d');
    const remaining = 100 - progress;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [progress, remaining > 0 ? remaining : 0],
          backgroundColor: ['rgb(249, 115, 22)', 'rgba(71, 85, 105, 0.4)'],
          borderColor: 'transparent',
          borderRadius: progress > 98 ? 0 : 10,
        }]
      },
      options: {
        responsive: true,
        cutout: '80%',
        plugins: { tooltip: { enabled: false } },
        animation: { duration: 800, easing: 'easeOutQuart' }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [progress]); // <-- Esta dependência é a chave do sucesso aqui.

  return (
    <div className="relative w-28 h-28 mx-auto">
      <canvas ref={chartRef}></canvas>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-slate-100">
          {Math.round(progress)}<span className="text-lg text-slate-400">%</span>
        </span>
      </div>
    </div>
  );
}