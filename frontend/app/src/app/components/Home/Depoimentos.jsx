// components/Home/Depoimentos.jsx
'use client'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ViewBasedAnimation from './ViewBasedAnimation';

export default function Depoimentos() {
  const feedbacks = [
    { nome: 'Hércules Financeiro', texto: 'Com Atheos, dominei minhas finanças como um verdadeiro semideus!' },
    { nome: 'Afrodite Investidora', texto: 'Nunca me senti tão confiante com meus investimentos! Atheos é divino!' },
    { nome: 'Poseidon Economista', texto: 'Controle absoluto das finanças, como controlo os mares!' }
  ];

  return (
    <section className="py-24 bg-black text-neutral-100 px-6">
      <ViewBasedAnimation className="max-w-4xl mx-auto flex flex-col items-center gap-12">
        <h2 className="text-5xl md:text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500">
          Vozes do Olimpo
        </h2>
        
        <div className="w-full">
          <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay interval={3000} transitionTime={600} showArrows={true} className="text-white">
            {feedbacks.map(({ nome, texto }, i) => (
              <div key={i} className="px-10 py-8">
                <blockquote className="max-w-2xl mx-auto">
                  <p className="text-xl md:text-2xl italic text-slate-200">"{texto}"</p>
                  <footer className="mt-6">
                    <p className="font-bold text-orange-400">{nome}</p>
                  </footer>
                </blockquote>
              </div>
            ))}
          </Carousel>
        </div>
      </ViewBasedAnimation>
    </section>
  )
}