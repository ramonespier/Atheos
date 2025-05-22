export default function Sidebar() {
    return (
      <aside className="bg-[#1C1B18] text-white w-64 min-h-screen p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8">🏛️ Olympus Finance</h1>
          <nav className="flex flex-col gap-4">
            {['Dashboard', 'Transações', 'Orçamento', 'Metas', 'Relatórios', 'Configurações'].map((item) => (
              <a key={item} href="#" className="flex items-center gap-2 hover:text-yellow-400">
                <span>•</span>
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="bg-[#2A2721] p-4 rounded mt-8">
          <h2 className="font-semibold mb-2">Sabedoria de Zeus</h2>
          <p className="text-sm">"Economize como Hades guarda suas riquezas, invista como Hermes negocia, e gaste com a sabedoria de Atena."</p>
        </div>
      </aside>
    );
  }
  