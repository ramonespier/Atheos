export default function BannerChamada() {
    return (
        <section className="w-full bg-gradient-to-r from-orange-700 to-amber-600 py-14 flex flex-col items-center gap-6 text-white">
            <h2 className="text-4xl md:text-6xl font-bold text-center">
                Junte-se aos Deuses!
            </h2>
            <p className="text-lg md:text-xl text-center max-w-2xl">
                Torne-se mestre das suas finanças com Atheos. Comece agora sua jornada rumo à sabedoria divina!
            </p>
            {/* O botão continua claro, criando um ótimo ponto de foco */}
            <a id="depoimentos" href="/login" className="bg-white text-orange-700 font-semibold py-3 px-8 rounded-xl hover:bg-orange-50 transition-all">
                Fazer Login/Cadastro
            </a>
        </section>
    )
}