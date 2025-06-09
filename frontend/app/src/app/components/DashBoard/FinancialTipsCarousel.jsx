"use client";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa o CSS
import { Lightbulb, PiggyBank, BarChart2 } from 'lucide-react';

const tips = [
  {
    icon: <PiggyBank className="w-8 h-8 text-orange-400" />,
    title: "A Regra 50/30/20",
    text: "Destine 50% de sua renda para necessidades, 30% para desejos e 20% para poupança e investimentos.",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-orange-400" />,
    title: "Crie um Fundo de Emergência",
    text: "Tenha o equivalente a 3-6 meses de suas despesas guardado para imprevistos. A paz de espírito não tem preço.",
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-orange-400" />,
    title: "Revise Seus Gastos",
    text: "Periodicamente, analise suas despesas. Muitas vezes encontramos pequenos gastos que, somados, fazem uma grande diferença.",
  },
];

const FinancialTipsCarousel = () => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-xl shadow-black/30 overflow-hidden">
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={6000}
        transitionTime={700}
        showArrows={false}
        className="h-full"
      >
        {tips.map((tip, index) => (
          <div key={index} className="p-6 flex flex-col items-center justify-center text-center h-full text-white">
            <div className="mb-4">{tip.icon}</div>
            <h4 className="font-bold text-lg text-orange-400">{tip.title}</h4>
            <p className="text-slate-300 mt-2 text-sm max-w-xs">{tip.text}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default FinancialTipsCarousel;