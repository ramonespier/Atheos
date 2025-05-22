export default function Header() {
    return (
      <header className="flex justify-between items-center bg-[#1C1B18] text-white p-6 border-b border-[#333]">
        <h2 className="text-2xl font-bold">Olympus Finance</h2>
        <div className="flex gap-4">
          <input className="bg-[#2A2721] text-sm p-2 rounded focus:outline-none" placeholder="Buscar..." />
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded">+ Nova Transação</button>
        </div>
      </header>
    );
  }
  