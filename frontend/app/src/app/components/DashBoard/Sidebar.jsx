import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTachometerAlt, faExchangeAlt, faBullseye, faCog } from '@fortawesome/free-solid-svg-icons'

export default function Sidebar() {
  const menuItems = [
    { label: 'Dashboard', icon: faTachometerAlt },
    { label: 'Transações', icon: faExchangeAlt },
    { label: 'Metas', icon: faBullseye },
    { label: 'Configurações', icon: faCog },
  ]

  return (
    <aside
      aria-label="Sidebar principal"
      className="
        bg-[#1C1B18] text-white w-48 min-h-screen p-4
        flex flex-col justify-between
        shadow-lg
        fixed md:static
        z-30
        transition-transform duration-300 ease-in-out
        md:translate-x-0 -translate-x-full md:flex
      "
    >
      <div>
        <h1
          tabIndex={0}
          className="
            text-xl font-extrabold mb-6 tracking-wider select-none
            hover:text-yellow-400 transition-colors duration-200 cursor-pointer
          "
        >
          PROJECT <span className="text-yellow-400">ATHEOS</span>
        </h1>

        <nav className="flex flex-col gap-4" aria-label="Menu de navegação">
          {menuItems.map(({ label, icon }) => (
            <a
              key={label}
              href="#"
              className="
                flex items-center gap-2 text-base font-medium
                rounded-md px-2 py-2
                hover:text-yellow-400 hover:bg-yellow-900/20
                focus:outline-none focus:ring-2 focus:ring-yellow-400
                transition-colors duration-200
                select-none group
              "
              tabIndex={0}
              role="link"
              aria-label={`Ir para ${label}`}
            >
              <FontAwesomeIcon
                icon={icon}
                className="
                  text-yellow-400 w-4 h-4 shrink-0
                  group-hover:scale-110 group-hover:text-yellow-300 transition-transform duration-200
                "
              />
              <span className="group-hover:underline">{label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div
        className="
          bg-[#2A2721] p-4 rounded-lg mt-8
          shadow-inner
          text-yellow-300
          select-text
          font-semibold
          text-xs
          leading-relaxed
          tracking-wide
          hover:bg-yellow-900/10 transition-colors duration-200 cursor-pointer
        "
        tabIndex={0}
        aria-label="Mensagem motivacional do projeto"
      >
        <h2 className="mb-1 text-yellow-400 text-sm hover:underline cursor-pointer">
          Sabedoria de Athena
        </h2>
        <p>
          "Economize como <span className='text-red-500 hover:text-red-300 cursor-pointer'>Hades</span> guarda suas riquezas, invista como <span className='text-orange-400 hover:text-orange-300 cursor-pointer'>Hermes</span> negocia, mas também, viva um pouco do lazer, assim como <span className='text-purple-700 hover:text-purple-500 cursor-pointer'>Dionísio</span>."
        </p>
      </div>
    </aside>
  )
}
