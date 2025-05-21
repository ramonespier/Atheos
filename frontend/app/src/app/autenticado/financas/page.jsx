"use client"

// teste para rota que requer login

import { useEffect, useState } from "react";

export default function Financas() {
    const [usuario, setUsuario] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setTimeout(() => {
                window.location.href = '/'
            }, 600);
            return;
        }

        fetch('http://localhost:3001/usuario/categoria', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log('Status da resposta: ', res.status)
                if (!res.ok) throw new Error('Falha na autenticação');
                return res.json();
            })
            .then(data => {
                console.log('Dados recebidos: ', data)
                setUsuario(data);
            })
            .catch(err => {
                console.error('Erro:', err);
            })
    }, [])

    if (!usuario) return 'Login necessário';

    return (
        <div>
            {usuario.map(view => (
                <div key={view.id ?? `cat-${view.categoria_nome}-${view.categoria_tipo}`}
                className="m-5">
                    {view.categoria_nome || 'Sem nome'} <br />
                    {view.categoria_tipo || 'Sem tipo'} <br />
                    {view.usuario_id || 'Sem id'}
                </div>
            ))}

        </div>
    )
}