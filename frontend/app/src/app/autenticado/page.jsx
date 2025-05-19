"use client"
import { useEffect, useState } from "react";
export default function Autenticado() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setTimeout(() => {
        window.location.href = '/'
      }, 2000);
      return;
    }

    setCarregando(true);

    fetch('http://localhost:3001/usuario/autenticado', {
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
        setCarregando(false);
      })
      .catch(err => {
        console.error('Erro:', err);
        setTimeout(() => {
          window.location.href = '/'
        }, 2000);
      });
  }, []);

  if (carregando) {
    return <div>Carregando...</div>;
  }

  if (!usuario) {
    return <div>Não foi possível carregar os dados do usuário</div>;
  }
  console.log(usuario)

  return (
    <div>
      <h1>Bem-vindo!</h1>
      <p>Email: {usuario.email}</p>
      {usuario.nome && <p>Nome: {usuario.nome}</p>}
    </div>
  );
}