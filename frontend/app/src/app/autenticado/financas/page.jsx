"use client"

// teste para rota que requer login

import { useEffect } from "react";

export default function Financas() {

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setTimeout(() => {
                window.location.href = '/'
            }, 600);
            return;
        }
    })

    return (
        <div>oiii</div>
    )
}