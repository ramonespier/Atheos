import Sidebar from '../../components/DashBoard/Sidebar'
import Header from '../../components/DashBoard/Header'
import Footer from '../../components/DashBoard/Footer.jsx'



export default function Extratos() {
  return (
    <div className="flex font-minhaFonte">
      <Sidebar />
      <main className="flex-1 bg-[#121210] min-h-screen flex flex-col">
        <Header />

        <a>texto teste</a>

        {/* LISTAS */}

        <Footer />
      </main>
    </div>
  )
}
