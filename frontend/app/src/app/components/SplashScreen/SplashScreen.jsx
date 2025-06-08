"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)"
      }}
    >
      {/* Efeito de brilho absoluto - LARANJA */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.4 }}
        transition={{ 
          delay: 0.2,
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 mx-auto w-40 h-40 rounded-full bg-orange-500 blur-3xl pointer-events-none"
        style={{
          top: "calc(50% - 5rem)"
        }}
      />

      <motion.div
        initial={{ y: -20, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        className="relative z-10"
      >
        <Image
          src="/logo/logo.png"
          alt="Atheos Logo"
          width={120}
          height={120}
          priority
          className="relative z-10 opacity-95 drop-shadow-[0_0_15px_rgba(249,115,22,0.7)]"
        />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.2 }}
        className="text-gray-300 font-light tracking-wider relative z-10"
      >
        CARREGANDO SISTEMA...
      </motion.p>
      
      {/* Barra de progresso com degrade dourado */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "20%" }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="h-[2px] relative z-10 mt-4"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #f59e0b 50%, transparent 100%)"
        }}
      />
      
      {/* Efeito dourado adicional (opcional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(245,158,11,0.15) 0%, transparent 70%)"
        }}
      />
    </motion.div>
  );
}