"use client"

import { useEffect, useState } from "react";

function disconnect() {
  localStorage.removeItem('token')
  window.location.href = '/'
}

export default function Autenticado() {
  const [usuario, setUsuario] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)

    fetch(`http://localhost:3001/usuario/autenticado`, {
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

  console.log(usuario)

  return (
    <div>
      <h1>Bem-vindo!</h1>
      <p>Email: {usuario.email}</p>
      <p>Nome: {usuario.nome}</p>
      <p>id: {usuario.id}</p>
      <p>criado_em: {usuario.criado_em}</p>

      <span className="bg-blue-200 m-2 font-black text-black cursor-pointer" onClick={disconnect}>Desconectar</span>
      <a className="bg-blue-200 m-2 font-black text-black cursor-pointer" href="/autenticado/financas">Finanças</a>
    </div>
  );
}