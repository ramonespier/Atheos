import Sidebar from '../components/DashBoard/Sidebar'
import Header from '../components/DashBoard/Header'
import Card from '../components/DashBoard/Card'
import TransactionList from '../components/DashBoard/TransactionList'
import FinancialGoals from '../components/DashBoard/FinancialGoals'
import CategoryExpenses from '../components/DashBoard/CategoryExpenses'

export default function Home() {
  return (
    <div className="flex font-minhaFonte">
      <Sidebar />
      <main className="flex-1 bg-[#121210] min-h-screen">
        <Header />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Saldo Total" value="R$ 5280.75" description="Abençoado por Zeus" color="border-yellow-500" />
          <Card title="Receitas" value="R$ 3500.00" description="Fluxo abundante como os mares de Poseidon" color="border-blue-500" />
          <Card title="Despesas" value="R$ 2219.25" description="Controladas com o rigor de Hades" color="border-purple-500" />
          <Card title="Economias" value="R$ 1280.75" description="Acumuladas com a sabedoria de Atena" color="border-gray-500" />
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TransactionList />
          <FinancialGoals />
        </div>
        <div className="p-6">
          <CategoryExpenses />
        </div>
      </main>
    </div>
  )
}
