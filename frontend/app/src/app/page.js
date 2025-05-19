"use client"

import { useEffect, useState } from "react";

export default function Home() {

  // let token = localStorage.getItem('token')

  if (!token) {
    console.log('Token não encontrado')
    window.location.href = '/usuario'
    return;
  }

  console.log(token)  

  const [token, setToken] = useState(null)
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/usuario/login', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: usuarios
    })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Erro ao buscar usuários: ', err))
  }, [token])


  return (
    <div>
      <span>Lista de usuarios</span>

      {/* <ul>
        {
          usuarios.map(user => (
            <li key={user.id}>
              <p>{user.name}</p> - {user.email}
            </li>
          ))
        }
      </ul> */}

    </div>
  );
}
