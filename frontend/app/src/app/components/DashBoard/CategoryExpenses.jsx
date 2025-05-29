import BarChart from "../Doughnut/Doughnut.jsx";


export default function CategoryExpenses() {
  return (
    <section className="bg-gray-950 text-white p-6 rounded-3xl shadow-xl hover:shadow-orange-500/30 transition-all duration-300">
      <h3 className="text-lg font-bold mb-6 tracking-wide uppercase text-gray-300">Gráficos Referenciais</h3>

      <BarChart />
    </section>
  )
}
