// src/components/DashBoard/Card.js
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, duration: 0.5 } 
  }
};

export default function Card({ title, value, description, color = "border-orange-600/50" }) {
  // `color` agora é uma classe Tailwind completa para a borda
  return (
    <motion.div
      variants={cardVariants}
      // Adicione `initial="hidden"` e `animate="visible"` se for animar individualmente
      // ou deixe que o container pai controle (como na página Extratos)
      className={`
        p-6 rounded-2xl 
        ${color} border-2 
        bg-slate-900/70 backdrop-blur-md 
        shadow-xl shadow-black/40 
        hover:shadow-lg hover:shadow-orange-500/30 
        hover:border-orange-500/70
        transition-all duration-300 ease-in-out
        flex flex-col gap-2
        transform hover:-translate-y-1
      `}
    >
      <h3 className="text-xs uppercase tracking-wider font-medium text-slate-400 group-hover:text-orange-300 transition-colors">
        {title}
      </h3>
      <p className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300 group-hover:from-orange-300 group-hover:to-orange-400 transition-all">
        {value}
      </p>
      <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
        {description}
      </p>
    </motion.div>
  );
}