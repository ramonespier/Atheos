import Link from "next/link";

// A pagina 404 é só criar o jsx com o nome not-found.jsx e criar o export default function e criar sua base
export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#1a160f] to-[#623d27] flex flex-col items-center justify-center p-6">
            <div className="max-w-xl text-center">
                <img src="../../Hermes/Hermes.webp" alt="Imagem" className="mx-auto mb-5 drop-shadow-lg w-40 max-w-sm border border-amber-500 rounded-b-full bg-amber-100" />

                <h1 className="text-6xl font-bold text-yellow-400 drop-shadow-md mb-4"> 404 </h1>
                <p className="text-2xl font-semibold text-gray-300 mb-2"> Página não encontrada</p>
                <p className="text-lg text-gray-400 mb-6">
                    "Parece que você se perdeu nos domínios de Hades... <br />
                    Mas não tema, o caminho de volta está <a className="text-yellow-400" href="/dashboard">logo aqui embaixo</a>." <br />
                    - Hermes
                </p>
                <div className="">
                    <Link href="/dashboard" className="inline-block px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-md transition hover:bg-yellow-400"> Retornar ao Dashboard </Link>
                </div>
                <div className="mt-5">

                    <Link href="/" className="inline-block px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-md transition hover:bg-yellow-400"> Retornar a Home </Link>
                </div>
            </div>
        </div>
    );
}
