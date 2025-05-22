"use client"

// teste para rota que requer login

import { useEffect, useState } from "react";

export default function Financas() {
    const [usuario, setUsuario] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');

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
                setTimeout(() => {
                    window.location.href = '/login'
                }, 600);
            })
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3001/usuario/categoria', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            const data = await response.json();
            // Atualize o estado ou mostre a resposta
        } catch (error) {
            console.error('Erro:', error);
        }
    };



    // SE QUISER SPLASH SCREEN ↓↓↓↓↓↓

    // if (!usuario) { 
    //     return (
    //         <div>Carregando. . .</div>
    //     )
    // }

    return (
        <div>
            {usuario.map(view => (
                <div key={view.id ?? `cat-${view.categoria_nome}-${view.categoria_tipo}`}
                    className="m-5 border">
                    {view.categoria_nome || 'Sem nome'} <br />
                    {view.categoria_tipo || 'Sem tipo'} <br />
                    {view.usuario_id || 'Sem id'}
                </div>
            ))}

            <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" required />

                <label htmlFor="tipo">Tipo:</label>
                <input type="text" id="tipo" name="tipo" required />

                <button type="submit">Criar categoria</button>
            </form>

            <div id="response">
                Resposta do servidor:
                <pre id='responseContent'></pre>
            </div>



        </div>
    )
}