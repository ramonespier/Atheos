"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/dashboard") return "Dashboard ATHEOS";
    if (pathname.startsWith("/dashboard/extratos")) return "Extratos";
    if (pathname.startsWith("/dashboard/metas")) return "Metas";
    if (pathname.startsWith("/dashboard/config")) return "Configurações";
    return "Dashboard ATHEOS"; // fallback se não cair em nada
  };

  return (
    <header
      style={{ '--background': '#1d293d' }}
      className="
        flex justify-between items-center
        bg-slate-950/40 backdrop-blur-md
        text-white
        px-8 py-5
        border-b border-gray-700
        shadow-lg shadow-neutral-900
        sticky top-0 z-40
        transition-colors duration-500
      "
    >
      <h2
        tabIndex={0}
        className="
          text-4xl font-extrabold tracking-wide
          bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500
          bg-clip-text text-transparent
          cursor-pointer
          hover:brightness-110 hover:scale-105
          transition transform duration-400 ease-out
          focus:outline-none focus:ring-2 focus:ring-orange-400 rounded
          select-none
        "
        aria-label={getTitle()}
      >
        {getTitle()}
      </h2>
    </header>
  )
}
