"use client"
import HeaderHome from "./components/Home/HeaderHome.jsx";
import Informacoes from "./components/Home/Informacoes.jsx";
import SecaoApresentacao from "./components/Home/SecaoApresentacao.jsx";

export default function Home() {
  return (
    <div>
      <HeaderHome />
      <SecaoApresentacao />
      <Informacoes />
      
    </div>
  )
}
