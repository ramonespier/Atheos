'use client'

import { useState, useEffect } from "react";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend
);

export default function DoughnutChart() {
  const [chartData, setChartData] = useState({
    datasets: []
  });

  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      try {
        // Busca as transações do usuário
        const response = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar transações');

        const transacoes = await response.json();

        // Calcula totais de entrada e saída
        const entrada = transacoes
          .filter(t => t.tipo === 'entrada')
          .reduce((acc, curr) => acc + Number(curr.valor), 0);

        const saida = transacoes
          .filter(t => t.tipo === 'saida')
          .reduce((acc, curr) => acc + Number(curr.valor), 0);

        setChartData({
          labels: ['Entrada', 'Saída'],
          datasets: [
            {
              label: 'Fluxo Financeiro',
              data: [entrada, saida],
              backgroundColor: [
                '#0ded00', // Verde para entradas
                '#ff1100'  // Vermelho para saídas
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }
          ]
        });

        setChartOptions({
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#fff', // Cor branca para legenda
                font: {
                  family: "'Inter', sans-serif"
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(context.raw);
                  return label;
                }
              }
            },
            title: {
              display: true,
              text: 'Fluxo Financeiro',
              color: '#fff',
              font: {
                size: 16,
                family: "'Inter', sans-serif"
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true,
          cutout: '50%',
        });

      } catch (error) {
        setError(error.message);
        console.error('Erro ao carregar dados para gráfico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="size-56 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="size-56 flex items-center justify-center">
        <div className="text-red-500">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="size-96 p-4 rounded-lg border border-gray-700">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}