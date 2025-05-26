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
                bg-slate-950/40
                backdrop-blur-md 
                shadow-lg
                shadow-neutral-900
            ">

            <div className="flex items-center gap-5">
                <img src="/vercel.svg" alt="Logotipo" className="w-12 h-12" />
                <h1 className="font-extrabold md:text-3xl text-xl">ATHEOS</h1>
            </div>

            <nav className="space-x-4">
                <button className="md:p-3 p-2 bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-lg font-semibold">
                    <a href="/login">Faça Login</a>
                </button>
            </nav>
        </header>
    )
}