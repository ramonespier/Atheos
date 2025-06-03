// src/components/DashBoard/CategoryExpenses.js
import React, { Suspense } from 'react'; // Adicionado Suspense para lazy loading (opcional, mas bom)
import { motion } from "framer-motion";
import { FiPieChart, FiLoader } from "react-icons/fi"; // Adicionado FiLoader

// Lazy load do componente Doughnut
const Doughnut = React.lazy(() => import("../Doughnut/Doughnut.jsx"));

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } }
};

export default function CategoryExpenses() {
  return (
    <motion.section 
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="
        bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-orange-900/10 
        backdrop-blur-md text-slate-200 
        p-4 sm:p-5 rounded-xl 
        shadow-lg shadow-black/50 
        border border-slate-700/40
        hover:border-orange-500/30 transition-colors duration-200
        flex flex-col min-h-[280px] sm:min-h-[320px] {/* Adiciona uma altura mínima para o card */}
      "
    >
      <h3 className="
        text-base sm:text-lg font-semibold mb-3 sm:mb-4
        text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500
        flex items-center gap-1.5
      ">
        <FiPieChart className="text-orange-500" size={18} />
        Gráficos
      </h3>

      {}
      <div className="relative flex-grow w-full h-auto min-h-[200px] sm:min-h-[240px] flex items-center justify-center"> 
        {}
        <Suspense 
          fallback={
            <div className="flex flex-col items-center justify-center text-slate-500">
              <FiLoader className="animate-spin text-orange-500 text-2xl mb-2" />
              <span className="text-xs">Carregando gráfico...</span>
            </div>
          }
        >
          {}
          <Doughnut /* chartOptions={{ maintainAspectRatio: false }} */ />
        </Suspense>
      </div>
    </motion.section>
  )
}