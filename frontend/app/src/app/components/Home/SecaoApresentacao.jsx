import './home.css'

export default function SecaoApresentacao() {
    return (
        <section className='flex justify-center py-20 md:px-0 p-7'>
            <div className="md:w-8/12 flex flex-col items-center justify-center gap-9">
                <div>
                    <h1 id="sabedoria" className='md:text-7xl text-5xl text-center 
                    bg-gradient-to-r 
                    from-indigo-700 via-indigo-400 to-indigo-700
                    text-transparent bg-clip-text font-semibold'>
                        Alcance a Sabedoria Financeira dos Deuses
                    </h1>
                </div>
                <div>
                    <p className='text-xl text-center text-neutral-100/70'>Atheos é seu guia divino para conquistar a prosperidade. Domine suas finanças com ferramentas poderosas e a inspiração da mitologia grega.</p>
                </div>

                <button className='bg-gradient-to-r p-3
                from-indigo-700 to-indigo-500 rounded-xl '>
                    <a href="/login">Inicie sua Jornada Divinia</a>
                </button>

                <div className="rounded-full size-80">
                    <img src="/PackAtheos/7.png" alt="Moeda Atheos" />
                </div>
            </div>

        </section>
    )
}