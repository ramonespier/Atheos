'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  Settings,
  Menu,
  X,
  CircleDollarSign, // <--- ÍCONE ALTERADO AQUI
  BrainCircuit,
} from 'lucide-react'

// --- Variantes de Animação (Framer Motion) ---

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 120, damping: 20, staggerChildren: 0.07 },
  },
  exit: {
    x: '-100%',
    transition: { duration: 0.2 },
  },
};

const navItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Transações', icon: ArrowRightLeft, href: '/dashboard/extratos' },
    { label: 'Metas', icon: Target, href: '/dashboard/metas' },
    { label: 'Configurações', icon: Settings, href: '/dashboard/config' },
  ]

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="
          md:hidden fixed top-4 left-4 z-[100] p-2.5 rounded-full
          bg-slate-800/80 text-orange-400 backdrop-blur-sm
          hover:bg-slate-700/90 hover:text-orange-300
          transition-colors duration-300
          border border-slate-700
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950
        "
        aria-label="Abrir ou fechar menu"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? 'x' : 'menu'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-[80] md:hidden"
          aria-hidden="true"
        />
      )}

      <motion.aside
        aria-label="Sidebar principal"
        className={clsx(`
          bg-slate-900/80 backdrop-blur-lg text-slate-200
          w-64 min-h-screen p-4 flex flex-col justify-between
          border-r border-slate-800
          fixed z-[90] top-0 left-0
          md:static md:translate-x-0
        `, {
          'translate-x-0': open,
          '-translate-x-full': !open,
        })}
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div>
          {/* Logo/Título do Projeto */}
          <motion.div variants={navItemVariants}>
            <Link href="/dashboard" className="group flex items-center gap-3 px-2 mb-12">
              {/* --- ÍCONE ALTERADO AQUI --- */}
              <CircleDollarSign className="h-10 w-10 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
              <h1 className="
                text-2xl font-bold tracking-wider select-none
                text-slate-100 group-hover:text-white transition-colors duration-300
              ">
                ATHEOS
              </h1>
            </Link>
          </motion.div>

          {/* Menu de Navegação */}
          <motion.nav
            className="flex flex-col gap-2"
            aria-label="Menu de navegação"
          >
            {menuItems.map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href;
              return (
                <motion.div key={label} variants={navItemVariants}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={clsx(`
                      flex items-center gap-4 text-sm font-medium rounded-md px-3 py-2.5
                      transition-all duration-200 select-none group relative
                      focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900
                    `, {
                      'bg-orange-500/10 text-orange-400': isActive,
                      'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50': !isActive,
                    })}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full"
                        />
                      )}
                    </AnimatePresence>
                    <Icon className={clsx("h-5 w-5 shrink-0", {
                      "text-orange-400": isActive,
                    })} />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        </div>

        {/* Box "Sabedoria de Athena" */}
        <motion.div
          variants={navItemVariants}
          className="
            bg-slate-800/50 border border-slate-700/50
            p-4 rounded-lg mt-8
            text-slate-400 text-xs leading-relaxed
          "
        >
          <div className="flex items-center gap-2 mb-3 text-orange-400">
            <BrainCircuit size={18} />
            <h2 className="font-semibold text-sm text-slate-200">
              Sabedoria de Athena
            </h2>
          </div>
          <p>
            "Equilibre a rigidez de{' '}
            <span className="font-semibold text-slate-300">Hades</span>,
            a agilidade de{' '}
            <span className="font-semibold text-slate-300">Hermes</span>
            , e a alegria de{' '}
            <span className="font-semibold text-slate-300">Dionísio</span>
            ."
          </p>
        </motion.div>
      </motion.aside>
    </>
  )
}