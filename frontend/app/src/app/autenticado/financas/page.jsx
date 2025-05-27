"use client"

// teste para rota que requer login

import { useEffect, useState } from "react";

export default function Financas() {
    const [usuario, setUsuario] = useState([]);
    const [transferencia, setTransferencia] = useState(null)
    const backendUrl = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:3001`;


    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token)

        fetch(`${backendUrl}/usuario/autenticado`, {
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
                setUsuario(data);

            })
            .catch(err => {
                console.error('Erro:', err);
                window.location.href = '/login'
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${backendUrl}/usuario/extratos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            const data = await response.json();
            setTransferencia(data);
            // Atualize o estado ou mostre a resposta
        } catch (error) {
            console.error('Erro:', error);
        }
    };


    // SE QUISER SPLASH SCREEN ↓↓↓↓↓↓

    if (!usuario) {
        return (
            <div>Carregando. . .</div>
        )
    }

    // if (!transferencia) { 
    //     return (
    //         <div>Carregando. . .</div>
    //     )
    // }

    return (
        <div>

            {/* Verificação em 3 etapas seguras: */}
            {Array.isArray(usuario) && usuario.length > 0 ? (
                usuario.map(view => (
                    <div key={view.id || Date.now()} className="m-5 border p-3">
                        {/* Renderização segura com fallbacks: */}
                        <p>Valor: {view.valor ?? 'Sem valor'}</p>
                        <p>Tipo: {view.tipo ?? 'Sem tipo'}</p>
                        <p>Descrição: {view.descricao ?? 'Sem descrição'}</p>
                        <p>Data: {view.data ?? 'Sem data'}</p>
                        <p>ID: {view.usuario_id ?? 'Sem ID'}</p>
                    </div>
                ))
            ) : (
                <div className="m-5 p-3 border">Nenhum dado disponível</div>
            )}


            <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" required />

                <label htmlFor="tipo">Tipo:</label>
                <select name="tipo" id="tipo">
                    <option value="Entrada" key="Entrada">Entrada</option>
                    <option value="Saída" key="Saída">Saída</option>
                </select>

                <label htmlFor="valor"></label>
                <input type="number" name="valor" id="valor" />

                <label htmlFor="descricao"></label>
                <textarea name="descricao" id="descricao"></textarea>

                <button type="submit">Adicionar transferência</button>

            </form>

            <div id="response">
                Resposta do servidor:
                <pre id='responseContent'></pre>
            </div>



        </div>
    )
}