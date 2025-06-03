// src/components/DashBoard/FinancialGoals.js
import { motion } from "framer-motion";
import { FiTarget } from "react-icons/fi";

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeInOut", staggerChildren: 0.08 } // Stagger menor
  }
};

const goalItemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 110 } } // Mola mais suave
};

export default function FinancialGoals() {
  const metas = [ // Dados de exemplo
    { id: 'pc-gamer', objetivo: 'PC Gamer', progresso: 75 }, // Nome mais curto
    { id: 'viagem-grecia', objetivo: 'Viagem Grécia', progresso: 50 },
    { id: 'quitar-dividas', objetivo: 'Quitar Dívidas', progresso: 90 },
  ];

  return (
    <motion.section 
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="
        bg-gradient-to-tl from-slate-900/70 via-slate-800/60 to-orange-900/5
        backdrop-blur-md text-slate-200 
        p-4 sm:p-5 rounded-xl 
        shadow-lg shadow-black/50 
        border border-slate-700/40
        hover:border-orange-500/30 transition-colors duration-200
        flex-1
      " // Paddings, rounded menores
    >
      <h3 className="
        text-base sm:text-lg font-semibold mb-4 sm:mb-5 {/* Fonte e margem menores */}
        text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500
        flex items-center gap-1.5 {/* Gap menor */}
      ">
        <FiTarget className="text-orange-500" size={18} /> {/* Ícone menor */}
        Metas Financeiras
      </h3>

      <div className="space-y-3 sm:space-y-4"> {/* Espaçamento menor */}
        {metas.map((meta) => (
          <motion.div 
            key={meta.id}
            variants={goalItemVariants}
            className="group"
          >
            <div className="flex justify-between text-xs sm:text-sm mb-1 text-slate-300 group-hover:text-orange-300 transition-colors"> {/* Fonte menor */}
              <span className="font-medium truncate max-w-[70%]">{meta.objetivo}</span> {/* Truncate e max-width */}
              <span className="font-semibold">{meta.progresso}%</span>
            </div>

            <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden shadow-inner"> {/* Barra mais fina */}
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${meta.progresso}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ boxShadow: `0 0 6px rgba(249, 115, 22, ${meta.progresso / 250 + 0.05})` }} // Sombra mais sutil
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}