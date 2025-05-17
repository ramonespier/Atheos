"use client"

import { useState } from 'react';
import Head from 'next/head';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // alternar entre login e cadastro
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '' // para cadastro
  });
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem('');

    try {
      const endpoint = isLogin ? '/usuario/login' : '/usuario/cadastro';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(isLogin ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!');
      
        if (isLogin && data.token) {
          localStorage.setItem('token', data.token); //  armazena o token JWT
          console.log('Token armazenado:', data.token);

          // redirecionamento após login
           window.location.href = '/'; // ou outra rota protegida
        }

        // limpar formulário após cadastro
        if (!isLogin) {
          setFormData({
            email: '',
            senha: '',
            nome: ''
          });
        }
      
      } else {
        setMensagem(data.err || `Erro no ${isLogin ? 'login' : 'cadastro'}`);
      }
      console.log(response)
    } catch (err) {
      console.error('Erro na requisição:', err);
      setMensagem('Erro na comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>{isLogin ? 'Login' : 'Cadastro'}</title>
      </Head>

      <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <br />
          </>
        )}
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />
        <br />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
        </button>
      </form>

      <button 
        type="button" 
        onClick={() => setIsLogin(!isLogin)}
        className="toggle-button"
      >
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
      </button>

      {mensagem && (
        <div className={`mensagem ${mensagem.includes('sucesso') ? 'success' : 'error'}`}>
          {mensagem}
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          text-align: center;
          color: #333;
        }
        input {
          width: 100%;
          padding: 0.8rem;
          margin: 0.5rem 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        button[type="submit"] {
          width: 100%;
          padding: 0.8rem;
          margin-top: 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        button[type="submit"]:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .toggle-button {
          width: 100%;
          margin-top: 1rem;
          background: none;
          border: none;
          color: #0070f3;
          cursor: pointer;
          text-align: center;
          font-size: 0.9rem;
        }
        .mensagem {
          margin-top: 1rem;
          padding: 0.8rem;
          border-radius: 4px;
          text-align: center;
        }
        .mensagem.success {
          background-color: #d4edda;
          color: #155724;
        }
        .mensagem.error {
          background-color: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  );
}

export { localStorage }