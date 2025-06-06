// components/DashBoard/MonthlyBalanceSummary.js
"use client";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import AnimatedNumber from './AnimatedNumber';

ChartJS.register(ArcElement, Tooltip);

export default function MonthlyBalanceSummary({ receitas, despesas }) {
  const resultadoLiquido = receitas - despesas;
  const percentualGasto = receitas > 0 ? (despesas / receitas) * 100 : 0;
  const status = resultadoLiquido >= 0 ? 'Superávit' : 'Déficit';

  const chartData = {
    datasets: [{
      data: [receitas, despesas],
      backgroundColor: ['rgba(52, 211, 153, 0.2)', 'rgba(248, 113, 113, 0.2)'],
      borderColor: ['#34d399', '#f87171'],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false, cutout: '80%',
    plugins: { tooltip: { enabled: false } },
  };

  return (
    <div className="relative p-[2px] rounded-2xl bg-white/5 h-full">
      <div className="bg-slate-950 p-6 rounded-[14px] h-full flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-slate-200">Balanço do Mês</h3>
          <div className={clsx(
            "px-3 py-1 text-xs font-bold rounded-full",
            status === 'Superávit' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {status}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
          {/* Coluna de Métricas */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-400">Resultado Líquido</p>
              <p className={clsx("text-3xl font-bold", status === 'Superávit' ? "text-green-400" : "text-red-400")}>
                R$ <AnimatedNumber value={resultadoLiquido} />
              </p>
            </div>
            <div className="space-y-3 mt-4">
              <div>
                <p className="text-sm text-green-400">Receitas</p>
                <p className="text-xl font-semibold text-slate-100">R$ <AnimatedNumber value={receitas} /></p>
              </div>
              <div>
                <p className="text-sm text-red-400">Despesas</p>
                <p className="text-xl font-semibold text-slate-100">R$ <AnimatedNumber value={despesas} /></p>
              </div>
            </div>
          </div>
          
          {/* Coluna do Gráfico e Barra */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-40 h-40 relative">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="w-full mt-4">
              <p className="text-center text-sm text-slate-400 mb-1">
                {percentualGasto.toFixed(0)}% da receita gasta
              </p>
              <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentualGasto > 100 ? 100 : percentualGasto}%` }}
                  transition={{ duration: 1, ease: "circOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}