import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-950 text-white">
      {/* Banner / Hero */}
      <section className="relative h-[70vh] flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[url('/banner.jpg')] bg-cover bg-center opacity-20 blur-sm"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-6xl sm:text-7xl font-extrabold mb-4 text-[#db6503] animate-pulse drop-shadow-lg">
            ATHEOS
          </h1>
          <p className="text-lg sm:text-xl text-zinc-300 font-light animate-fade-in-up">
            Uma plataforma divina para o controle absoluto das suas finanças.
          </p>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#104862]">Funcionalidades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Dashboard"
            color="#db6503"
            description="Resumo financeiro com gráficos interativos."
          />
          <FeatureCard
            title="Extratos"
            color="#104862"
            description="Histórico completo das suas transações."
          />
          <FeatureCard
            title="Metas"
            color="#78206e"
            description="Defina e acompanhe objetivos financeiros com clareza."
          />
          <FeatureCard
            title="Configurações"
            color="#ffffff"
            description="Personalize sua experiência no ATHEOS."
          />
        </div>
      </section>

      {/* Ações */}
      <section className="flex flex-col sm:flex-row justify-center gap-6 px-6 pb-24 text-center">
        <Link href="/login" className="bg-[#104862] hover:bg-[#0c3b4e] transition px-8 py-4 rounded-full font-bold text-white shadow-lg">
          Entrar
        </Link>
      </section>
    </main>
  );
}

function FeatureCard({ title, description, color }) {
  return (
    <div
      className="group bg-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-md hover:scale-[1.03] transition-transform duration-300 hover:border-white"
      style={{ boxShadow: `0 0 12px ${color}` }}
    >
      <h3 className="text-xl font-bold mb-2 group-hover:text-white" style={{ color }}>
        {title}
      </h3>
      <p className="text-zinc-400 group-hover:text-zinc-200 text-sm">{description}</p>
    </div>
  );
}
