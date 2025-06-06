// app/page.js (VERSÃO FINAL E SIMPLES)
"use client";
import HeaderHome from "./components/Home/HeaderHome.jsx";
import Informacoes from "./components/Home/Informacoes.jsx";
import SecaoApresentacao from "./components/Home/SecaoApresentacao.jsx";
import BannerChamada from "./components/Home/BannerChamada.jsx";
import Depoimentos from "./components/Home/Depoimentos.jsx";
import Rodape from "./components/Home/Rodape.jsx";

export default function Home() {
  return (
    <div className="bg-black">
      <HeaderHome />
      <main>
        <SecaoApresentacao />
        <Informacoes />
        <BannerChamada />
        <Depoimentos />
      </main>
      <Rodape />
    </div>
  );
}