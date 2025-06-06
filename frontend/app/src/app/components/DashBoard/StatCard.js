"use client";
import { motion } from 'framer-motion';
import clsx from 'clsx';
import AnimatedNumber from './AnimatedNumber';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function StatCard({ title, value, icon: Icon, color, sign }) {
  return (
    <motion.div variants={itemVariants} className="group relative p-[2px] rounded-2xl bg-white/5 from-orange-500/50 to-slate-700/50 bg-gradient-to-tr">
      <div className="flex flex-col h-full justify-between rounded-[14px] bg-slate-950 p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
        <div className="mt-2">
          <p className={clsx(
              "text-4xl font-bold tracking-tighter text-slate-50",
              { "text-green-400": color === "green", "text-red-400": color === "red" }
            )}
          >
            {sign && <span className="mr-1">{sign}</span>}
            R$ <AnimatedNumber value={value} />
          </p>
        </div>
      </div>
      {/* Efeito de Borda Animada */}
      <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#1e293b_50%,#f97316_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}