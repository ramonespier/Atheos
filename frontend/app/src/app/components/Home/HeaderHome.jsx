"use client"
// import { useState, useEffect } from "react";

export default function HeaderHome() {
    return (
        <header
            className="
                py-6 px-4 
                md:px-8 
                flex 
                justify-between
                items-center 
                sticky 
                top-0 
                z-50 
                bg-slate-900/80 
                backdrop-blur-md 
                shadow-lg
                shadow-neutral-900
            ">

            <div className="flex items-center gap-5">
                <img src="/vercel.svg" alt="Logotipo" className="w-12 h-12" />
                <h1 className="font-extrabold text-3xl">ATHEOS</h1>
            </div>

            <nav className="space-x-4">
                <button className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold">
                    <a href="/login">Faça Login</a>
                </button>
            </nav>


        </header>
    )
}