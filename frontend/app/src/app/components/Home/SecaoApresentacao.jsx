'use client'

import Image from 'next/image'

export default function SecaoApresentacao() {
  return (
    <section className="flex justify-center py-20 md:px-0 px-7 bg-black text-white">
      <div className="md:w-8/12 flex flex-col items-center justify-center gap-9">

        <h1
          id="sabedoria"
          className="
            md:text-7xl text-5xl text-center font-extrabold tracking-wide select-none
            bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-700
            text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,193,7,0.8)]
            hover:drop-shadow-[0_0_18px_rgba(255,193,7,1)]
            transition-all duration-300
            cursor-pointer
            active:scale-95
          "
        >
          Alcance a Sabedoria Financeira dos Deuses
        </h1>

        <p className="text-xl text-center text-neutral-100/70 max-w-2xl">
          Atheos é seu guia divino para conquistar a prosperidade. Domine suas finanças com ferramentas poderosas e a inspiração da mitologia grega.
        </p>

        <a
          href="/login"
          className="
            inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-semibold
            py-3 px-6 rounded-xl shadow-lg
            hover:scale-105 hover:shadow-yellow-500/50
            transition-transform duration-300
            ring-2 ring-yellow-800/50
            drop-shadow-[0_0_10px_rgba(255,193,7,0.5)]
          "
        >
          Inicie sua Jornada Divina
        </a>

        <div
          className="
            rounded-full overflow-hidden w-52 h-52 md:w-64 md:h-64
            ring-4 ring-yellow-700/60 shadow-lg
            hover:scale-105 transition-transform duration-300
          "
          aria-label="Imagem representativa do Olimpo"
        >
          <Image
            src="/ImgOlimpo/olimpo.jpg"
            alt="Moeda Atheos"
            width={256}
            height={256}
            className="object-cover w-full h-full"
          />
        </div>

      </div>
    </section>
  )
}
