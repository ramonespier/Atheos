export default function BannerChamada() {
    return (
        <section  className="w-full bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700 py-14 flex flex-col items-center gap-6 text-white">
            <h2 className="text-4xl md:text-6xl font-bold text-center">
                Junte-se aos Deuses!
            </h2>
            <p className="text-lg md:text-xl text-center max-w-2xl">
                Torne-se mestre das suas finanças com Atheos. Comece agora sua jornada rumo à sabedoria divina!
            </p>
            <a id="depoimentos" href="/login" className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-xl hover:bg-indigo-100 transition-all">
                Fazer Login/Cadastro
            </a>
        </section>
    )
}
