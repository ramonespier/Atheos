export default function Header() {
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
        aria-label="Dashboard ATHEOS"
      >
        Dashboard ATHEOS
      </h2>

      <nav className="hidden md:flex space-x-10">
        {['Dashboard', 'Relatórios', 'Configurações'].map((item, idx) => (
          <a
            key={idx}
            href={`/${item.toLowerCase()}`}
            className="
              relative text-sm font-semibold uppercase tracking-wider
              text-gray-300
              before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-gradient-to-r before:from-orange-400 before:via-yellow-400 before:to-orange-500 before:scale-x-0 before:origin-left before:transition-transform before:duration-300
              hover:text-white
              hover:before:scale-x-100
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950
              cursor-pointer
              select-none
              transition-colors duration-300
            "
            tabIndex={0}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  )
}
