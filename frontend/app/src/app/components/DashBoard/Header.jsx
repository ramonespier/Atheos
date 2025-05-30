"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/dashboard") return "Bem vinde ()";
    if (pathname.startsWith("/dashboard/extratos")) return "Extratos";
    if (pathname.startsWith("/dashboard/metas")) return "Metas";
    if (pathname.startsWith("/dashboard/config")) return "Configurações";
    return "Bem Vindo";
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ '--background': '#1d293d' }}
      className="
        flex justify-between items-center
        bg-slate-950/60 backdrop-blur-lg
        text-white
        px-8 py-6
        border-b border-gray-800
        shadow-2xl shadow-black/60
        sticky top-0 z-50
        transition-all duration-500
      "
    >
      <motion.h2
        tabIndex={0}
        whileHover={{ scale: 1.1, rotate: [-1, 0, 1, 0], transition: { duration: 0.4 } }}
        whileTap={{ scale: 0.95 }}
        className="
          text-4xl font-extrabold tracking-wide
          bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500
          bg-clip-text text-transparent
          cursor-pointer
          hover:brightness-125
          transition transform duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-orange-400 rounded-lg
          select-none drop-shadow-[0_0_8px_rgba(255,165,0,0.4)]
        "
        aria-label={getTitle()}
      >
        {getTitle()}
      </motion.h2>
    </motion.header>
  )
}
