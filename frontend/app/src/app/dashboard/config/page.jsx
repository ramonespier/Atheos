import Sidebar from '../../components/DashBoard/Sidebar'
import Header from '../../components/DashBoard/Header'
import Footer from '../../components/DashBoard/Footer.jsx'



export default function Extratos() {
  return (
    <div className="flex font-minhaFonte">
      <Sidebar />
      <main className="flex-1 bg-[#121210] min-h-screen flex flex-col">
        <Header />

        <div>
          <div>

            <div>
              <h1>Configurações</h1>
            </div>

            <div>
              <main>

                {/* Perfil */}
                <div>
                  <div>
                    <div>Perfil - descricao</div>
                    <div>nome e Email</div>
                  </div>
                </div>


                {/* Sobre */}
                <div>
                  <div>
                    <div>Sobre</div>
                    <div>Img</div>
                    <div>"Footer"</div>
                  </div>
                </div>

              </main>
            </div>

          </div>

        </div>
        <a>texto teste</a>

        <Footer />
      </main>
    </div>
  )
}
