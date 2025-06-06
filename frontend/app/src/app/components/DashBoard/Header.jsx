// components/DashBoard/Header.jsx (VERSÃO FINAL E APRIMORADA)
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

// Usando Lucide para ícones consistentes e elegantes
import { FiLayout, FiCreditCard, FiTarget, FiSettings, FiUser, FiLogOut, FiChevronRight } from "react-icons/fi";

// Mapeamento de rotas para títulos e ícones
const pageInfo = {
  "/dashboard": { title: "Dashboard", icon: FiLayout },
  "/dashboard/extratos": { title: "Extratos", icon: FiCreditCard },
  "/dashboard/metas": { title: "Metas", icon: FiTarget },
  "/dashboard/config": { title: "Configurações", icon: FiSettings },
};

export default function Header({ usuario }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Gera o título e o ícone com base na rota atual
  const currentPage = Object.values(pageInfo).find(p => pathname.startsWith(Object.keys(pageInfo).find(key => pageInfo[key] === p))) || { title: "Atheos", icon: FiLayout };

  // Gera os breadcrumbs (caminho de navegação)
  const breadcrumbs = pathname.split('/').filter(Boolean).map((part, index, arr) => {
    const path = `/${arr.slice(0, index + 1).join('/')}`;
    const info = pageInfo[path];
    return {
      label: info ? info.title : part.charAt(0).toUpperCase() + part.slice(1),
      href: path,
      isLast: index === arr.length - 1,
    };
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="sticky top-0 z-40 flex items-center justify-between gap-4 bg-slate-950/70 px-6 py-4 backdrop-blur-lg border-b border-slate-800/80 shadow-2xl shadow-black/50"
    >
      {/* Seção Esquerda: Título e Breadcrumbs */}
      <div className="flex items-center gap-3">
        <currentPage.icon className="h-7 w-7 text-orange-400" />
        <div className="flex items-center text-sm text-slate-400">
          {breadcrumbs.map(crumb => (
            <div key={crumb.href} className="flex items-center">
              <Link href={crumb.href} className={!crumb.isLast ? 'hover:text-white' : 'font-semibold text-white'}>
                {crumb.label}
              </Link>
              {!crumb.isLast && <FiChevronRight className="mx-1 h-4 w-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Seção Direita: Perfil do Usuário e Dropdown */}
      <div className="relative">
        <motion.button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 rounded-full bg-slate-800/70 p-2 pr-4 transition-colors hover:bg-slate-700/80"
          whileTap={{ scale: 0.95 }}
        >
          {/* Avatar genérico */}
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center font-bold text-slate-900">
            {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-slate-200">
            {usuario?.nome || 'Usuário'}
          </span>
        </motion.button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-slate-900 shadow-2xl shadow-black/50 ring-1 ring-slate-700/80 focus:outline-none"
            >
              <div className="p-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-white truncate">{usuario?.nome}</p>
                  <p className="text-xs text-slate-400 truncate">{usuario?.email}</p>
                </div>
                <div className="my-1 h-px bg-slate-700/80" />
                <Link
                  href="/dashboard/config"
                  onClick={() => setIsDropdownOpen(false)}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  <FiSettings className="h-5 w-5" />
                  Configurações
                </Link>
                <button
                  onClick={handleLogout}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400"
                >
                  <FiLogOut className="h-5 w-5" />
                  Sair
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}