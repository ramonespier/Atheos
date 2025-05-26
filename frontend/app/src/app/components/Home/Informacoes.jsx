'use client'
import { useState } from "react"

export default function Informacoes() {

    const cards = [
        {
            id: 1,
            foto: '/PackAtheos/2.png',
            titulo: 'Controle Divino',
            texto: 'Visualize suas finanças com clareza, como Zeus observando do Olimpo. Gráficos intuitivos e relatórios detalhados.',
            cores: 'from-yellow-700/40 to-yellow-400/40 border-yellow-400/50'
        },
        {
            id: 2,
            foto: '/PackAtheos/2.png',
            titulo: 'Orçamento Estratégico',
            texto: 'Crie orçamentos flexíveis e acompanhe seus gastos com a precisão de um tridente de Poseidon.',
            cores: 'from-blue-800/40 to-blue-500/40 border-blue-400/50'
        },
        {
            id: 3,
            foto: '/PackAtheos/2.png',
            titulo: 'Metas Inspiradoras',
            texto: 'Defina e alcance seus objetivos financeiros com a sabedoria e estratégia de Atena.',
            cores: 'from-neutral-800/40 to-neutral-500/40 border-neutral-400/50'
        },
        {
            id: 4,
            foto: '/PackAtheos/2.png',
            titulo: 'Segurança Celestial',
            texto: 'Seus dados protegidos com o mesmo zelo que Hermes guarda as mensagens dos deuses.',
            cores: 'from-red-800/40 to-red-500/40 border-red-400/50'
        }
    ]


    return (
        <section>
            <div className="p-10 flex gap-4 justify-center items-center flex-col">

                <h2 className='
                    md:text-7xl text-5xl text-center 
                    bg-gradient-to-r
                    from-indigo-700 via-indigo-400 to-indigo-700
                    text-transparent bg-clip-text font-semibold
                    '>Por que Atheos?</h2>

                <p className="text-xl text-center text-neutral-100/70">Inspirado pelos deuses, projetado para mortais. Oferecemos uma abordagem única para o gerenciamento financeiro.</p>

                <div className="flex justify-center items-center flex-wrap gap-10 m-8">
                    {cards.map(cards => (
                        <div key={cards.id} className={`md:size-80 flex justify-center rounded-xl flex-col items-center gap-3 border-2 p-7 backdrop-blur-md bg-gradient-to-r ${cards.cores} text-foreground`}>
                            <img src={cards.foto} alt="Foto do Card" className="size-20" />
                            <h3 className="text-xl font-bold">{cards.titulo}</h3>
                            <p className="text-justify">{cards.texto}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}