import Sidebar from '../components/DashBoard/Sidebar'
import Header from '../components/DashBoard/Header'
import TransactionList from '../components/DashBoard/TransactionList'
import FinancialGoals from '../components/DashBoard/FinancialGoals'
import CategoryExpenses from '../components/DashBoard/CategoryExpenses'
import Footer from '../components/DashBoard/Footer.jsx'

export default function Home() {
  return (
    <div className="flex font-minhaFonte">
      <Sidebar />
      <main className="flex-1 bg-[#121210] min-h-screen flex flex-col">
        <Header />

        {/* CARDS */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: 'Saldo Total do Mês', 
              value: '5280.75', 
              sign: '', 
              desc: 'Abençoado por Zeus', 
              color: 'border-yellow-500', 
              img: 'https://cdn-icons-png.flaticon.com/512/2918/2918245.png' // raio
            },
            { 
              title: 'Receitas do Mês', 
              value: '3500.00', 
              sign: '+', 
              desc: 'Fluxo abundante como os mares de Poseidon', 
              color: 'border-blue-500', 
              img: 'https://cdn-icons-png.flaticon.com/512/414/414927.png' // agua / mar
            },
            { 
              title: 'Despesas do Mês', 
              value: '2219.25', 
              sign: '-', 
              desc: 'Controladas com o rigor de Dionísio', 
              color: 'border-purple-500', 
              img: 'https://cdn-icons-png.flaticon.com/512/866/866043.png' // taça vinho
            },
            { 
              title: 'Economias do Mês', 
              value: '1280.75', 
              sign: '+', 
              desc: 'Acumuladas com a sabedoria de Hades', 
              color: 'border-red-500',  // borda vermelha Hades
              img: 'https://cdn-icons-png.flaticon.com/512/633/633657.png' // jóia / pedra
            },
          ].map((card, idx) => (
            <div 
              key={idx}
              className={`
                bg-[#1C1B18] text-white p-4 rounded-lg 
                shadow-md border-2 ${card.color}
                hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer
                flex justify-between items-center gap-4
              `}
            >
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-xl font-bold">
                  {card.sign}{' '}
                  R${' '}
                  {parseFloat(card.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-xs text-zinc-400">{card.desc}</span>
              </div>

              <img 
                src={card.img} 
                alt={card.title} 
                className="w-12 h-12 object-contain rounded"
              />
            </div>
          ))}
        </div>

        {/* LISTAS */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionList />
          <FinancialGoals />
        </div>

        <div className="p-6">
          <CategoryExpenses />
        </div>

        <Footer />
      </main>
    </div>
  )
}
