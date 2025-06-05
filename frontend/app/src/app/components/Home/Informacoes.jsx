'use client'

import Image from 'next/image'

export default function Informacoes() {
    const cards = [
        {
            id: 1,
            foto: '/PackAtheos/2.png',
            titulo: 'Controle Divino',
            texto: 'Visualize suas finanças com clareza, como Zeus observando do Olimpo. Gráficos intuitivos e relatórios detalhados.',
            cores: 'from-yellow-600/70 to-yellow-400/60 border-yellow-500/70',
            sombra: 'drop-shadow-[0_0_15px_rgba(252,211,77,0.8)]'
        },
        {
            id: 2,
            foto: '/PackAtheos/2.png',
            titulo: 'Orçamento Estratégico',
            texto: 'Crie orçamentos flexíveis e acompanhe seus gastos com a precisão de um tridente de Poseidon.',
            cores: 'from-blue-700/70 to-blue-500/60 border-blue-500/70',
            sombra: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]'
        },
        {
            id: 3,
            foto: '/PackAtheos/2.png',
            titulo: 'Metas Inspiradoras',
            texto: 'Defina e alcance seus objetivos financeiros com a sabedoria e estratégia de Atena.',
            cores: 'from-neutral-700/70 to-neutral-500/60 border-neutral-400/70',
            sombra: 'drop-shadow-[0_0_15px_rgba(107,114,128,0.8)]'
        },
        {
            id: 4,
            foto: '/PackAtheos/2.png',
            titulo: 'Segurança Celestial',
            texto: 'Seus dados protegidos com o mesmo zelo que Hermes guarda as mensagens dos deuses.',
            cores: 'from-red-700/70 to-red-500/60 border-red-500/70',
            sombra: 'drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]'
        }
    ]

    return (
        <section
            aria-labelledby="porque-atheos"
            className="w-full py-20 px-5 md:px-20 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 text-white"
        >
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-14">
                <h2
                    id="porque-atheos"
                    className="
            text-6xl md:text-7xl font-extrabold tracking-tight select-none
            bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-500
            text-transparent bg-clip-text
            drop-shadow-lg
            cursor-default
            uppercase
            "
                >
                    Por que <span className="text-yellow-300">Atheos</span>?
                </h2>

                <p className="text-lg md:text-xl max-w-3xl text-center text-yellow-100/80 leading-relaxed font-light tracking-wide">
                    Inspirado nos deuses do Olimpo, feito pra mortais que querem dominar suas finanças com poder e sabedoria. Aqui o controle é real e a segurança, divina.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
                    {cards.map(({ id, foto, titulo, texto, cores, sombra }) => (
                        <article
                            key={id}
                            className={`
                flex flex-col items-center text-center
                rounded-xl border-2 p-8
                bg-gradient-to-tr ${cores}
                border-opacity-60
                shadow-xl
                hover:scale-[1.06] hover:brightness-110
                transition-transform duration-300 ease-in-out
                cursor-pointer
                ${sombra}
              `}
                            tabIndex={0}
                            aria-label={`Card informativo sobre ${titulo}`}
                        >
                            <div className="relative w-24 h-24 mb-6 mx-auto rounded-full bg-black/40 shadow-md overflow-hidden">
                                <Image
                                    src={foto}
                                    alt={`${titulo} ícone`}
                                    fill
                                    sizes="96px"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 text-yellow-300 drop-shadow-md">{titulo}</h3>
                            <p id="cadastre" className="text-neutral-200 text-sm leading-relaxed">{texto}</p>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    )
}
