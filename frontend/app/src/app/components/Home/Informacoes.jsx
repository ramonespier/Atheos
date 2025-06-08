// components/Home/Informacoes.jsx (VERSÃO FINAL E CORRIGIDA)
'use client'
import ViewBasedAnimation from './ViewBasedAnimation';
import { FiBarChart2, FiShield, FiTarget, FiSmartphone } from 'react-icons/fi';
import { motion } from 'framer-motion'; // <-- AQUI ESTÁ A CORREÇÃO!

export default function Informacoes() {
    const cards = [
        {
            icon: FiBarChart2,
            titulo: 'Controle Divino',
            texto: 'Visualize suas finanças com clareza. Gráficos intuitivos e relatórios detalhados como a visão de Zeus no Olimpo.',
        },
        {
            icon: FiSmartphone,
            titulo: 'Acesso Celestial',
            texto: 'Acesse de qualquer dispositivo. Sua jornada financeira na palma da sua mão, com a velocidade de Hermes.',
        },
        {
            icon: FiTarget,
            titulo: 'Metas Estratégicas',
            texto: 'Defina e conquiste seus objetivos financeiros com a sabedoria e a estratégia de Atena.',
        },
        {
            icon: FiShield,
            titulo: 'Segurança Olímpica',
            texto: 'Seus dados são um tesouro. Protegemos suas informações com a segurança do cofre de Hades.',
        }
    ];

    return (
        <section id="destino" className="w-full py-24 px-5 bg-black text-white">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
                <ViewBasedAnimation>
                    <h2 className="text-6xl md:text-7xl font-extrabold tracking-tight text-center bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
                        Forjado para Campeões
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl text-center text-slate-300 mt-4">
                        Construído com as melhores tecnologias para garantir poder, sabedoria e segurança em sua jornada financeira.
                    </p>
                </ViewBasedAnimation>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    {cards.map(({ icon: Icon, titulo, texto }, index) => (
                        <motion.div
                            key={titulo}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 transition-colors"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="relative z-10">
                                <Icon className="w-10 h-10 mb-6 text-orange-400" />
                                <h3 className="text-2xl font-semibold mb-3 text-slate-100">{titulo}</h3>
                                <p  id="cadastre" className="text-slate-400 text-sm leading-relaxed">{texto}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}