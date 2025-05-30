"use client";

import Link from "next/link";

export default function HeaderHome() {
    return (
        <header
            className="
                sticky top-0 z-50
                bg-black bg-opacity-90 backdrop-blur-[14px]
                shadow-2xl shadow-black/90
                border-b border-yellow-600/60
                ring-1 ring-yellow-900/40
                px-6 md:px-12 py-4
                flex items-center justify-between
            "
        >
            <Link
                href="/"
                className="
                    flex items-center gap-4
                    hover:opacity-80
                    transition
                    select-none
                    group
                "
            >
                <img
                    src="/vercel.svg"
                    alt="Logotipo ATHEOS"
                    className="
                        w-10 h-10 md:w-12 md:h-12
                        drop-shadow-[0_0_6px_rgba(255,193,7,0.9)]
                        group-hover:scale-110
                        transition-transform
                    "
                />
                <span
                    className="
                        font-extrabold
                        text-2xl md:text-4xl tracking-wide
                        text-yellow-400
                        drop-shadow-[0_0_8px_rgba(255,193,7,0.8)]
                        group-hover:text-yellow-300
                        transition-colors
                    "
                >
                    ATHEOS
                </span>
            </Link>

            <nav>
                <Link
                    href="/login"
                    className="
                        inline-block
                        px-4 md:px-6 py-2 md:py-3
                        bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700
                        rounded-xl font-bold text-sm md:text-base
                        text-black
                        shadow-lg shadow-yellow-700/70
                        hover:bg-yellow-500
                        hover:brightness-110
                        active:scale-95
                        transition-all duration-300
                        ring-1 ring-yellow-900/40
                    "
                >
                    Faça Login
                </Link>
            </nav>
        </header>
    );
}
