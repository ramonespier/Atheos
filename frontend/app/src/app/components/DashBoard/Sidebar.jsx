'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTachometerAlt, faExchangeAlt, faBullseye, faCog, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { label: 'Dashboard', icon: faTachometerAlt, href: '/dashboard' },
    { label: 'Transações', icon: faExchangeAlt, href: '/dashboard/extratos' },
    { label: 'Metas', icon: faBullseye, href: '/dashboard/metas' },
    { label: 'Configurações', icon: faCog, href: '/dashboard/config' },
  ]

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="
          md:hidden fixed top-4 left-4 z-100 p-3 rounded-lg
          bg-yellow-600 text-black
          hover:bg-yellow-500
          transition-colors duration-300
          shadow-lg shadow-yellow-700/70
          focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
          active:scale-95
        "
        aria-label="Abrir ou fechar menu"
      >
        <FontAwesomeIcon icon={open ? faTimes : faBars} />
      </button>

      <aside
        aria-label="Sidebar principal"
        style={{ '--background': '#000000' }}
        className={`
          bg-[var(--background)] bg-opacity-90 backdrop-blur-[14px]
          text-white
          w-64 min-h-screen p-6
          flex flex-col justify-between
          shadow-2xl shadow-black/90
          fixed z-80 top-0 left-0
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
          border-r border-yellow-600/60
          ring-1 ring-yellow-900/40
        `}
      >
        <div>
          <h1
            tabIndex={0}
            className="
              text-3xl font-extrabold mb-10 tracking-wide select-none
              text-yellow-400 drop-shadow-[0_0_8px_rgba(255,193,7,0.8)]
              cursor-pointer
              hover:text-yellow-300
              transition-colors duration-250
              hover:drop-shadow-[0_0_14px_rgba(255,193,7,1)]
              active:scale-[0.98]
            "
          >
            PROJECT <span className="text-yellow-300">ATHEOS</span>
          </h1>

          <nav className="flex flex-col gap-6" aria-label="Menu de navegação">
            {menuItems.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                className="
                  flex items-center gap-4 text-lg font-semibold rounded-lg px-4 py-3
                  hover:text-yellow-300 hover:bg-yellow-900/40
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
                  transition-all duration-300 select-none
                  group
                  relative
                  active:scale-95
                "
                aria-label={`Ir para ${label}`}
              >
                <FontAwesomeIcon
                  icon={icon}
                  className="
                    text-yellow-400 w-6 h-6 shrink-0
                    group-hover:scale-125 group-hover:text-yellow-300
                    transition-transform duration-300
                    drop-shadow-[0_0_6px_rgba(255,193,7,0.9)]
                  "
                />
                <div className="flex flex-col w-full">
                  <span className="group-hover:underline">{label}</span>
                  <div
                    className="
                      bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700
                      h-2 rounded-full
                      scale-x-0 group-hover:scale-x-110
                      transform origin-left
                      transition-transform duration-300
                      mt-1
                      drop-shadow-[0_0_8px_rgba(255,193,7,0.8)]
                    "
                  ></div>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="
            bg-black bg-opacity-70 backdrop-blur-md
            p-6 rounded-2xl mt-12 shadow-inner
            text-yellow-300 select-text font-semibold text-sm leading-relaxed tracking-wide
            hover:bg-yellow-900/25
            transition-colors duration-300
            cursor-pointer
            ring-1 ring-yellow-900/50
            drop-shadow-[0_0_10px_rgba(255,193,7,0.5)]
          "
          tabIndex={0}
          aria-label="Mensagem motivacional do projeto"
        >
          <h2 className="mb-3 text-yellow-400 text-base hover:underline cursor-pointer font-extrabold drop-shadow-[0_0_6px_rgba(255,193,7,1)]">
            Sabedoria de Athena
          </h2>
          <p className="text-[0.9rem] leading-tight">
            "Economize como{' '}
            <span className="text-red-600 hover:text-red-400 cursor-pointer font-bold drop-shadow-[0_0_4px_rgba(220,20,60,0.9)]">
              Hades
            </span>{' '}
            guarda suas riquezas, invista como{' '}
            <span className="text-orange-500 hover:text-orange-400 cursor-pointer font-bold drop-shadow-[0_0_4px_rgba(255,140,0,0.9)]">
              Hermes
            </span>{' '}
            negocia, mas também, viva um pouco do lazer, assim como{' '}
            <span className="text-purple-900 hover:text-purple-600 cursor-pointer font-bold drop-shadow-[0_0_5px_rgba(128,0,128,0.9)]">
              Dionísio
            </span>
            ."
          </p>
        </div>
      </aside>
    </>
  )
}
