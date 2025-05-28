"use client"

import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:3001`;

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
      const response = await fetch(`${backendUrl}${endpoint}`, {
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
          localStorage.setItem('token', data.token);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 600); 
        }

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
    } catch (err) {
      console.error('Erro na requisição:', err);
      setMensagem('Erro na comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1c2c] via-[#2e2c54] to-[#1a1c2c] bg-cover bg-center px-4">
  <Head>
    <title>{isLogin ? 'Login' : 'Cadastro'}</title>
  </Head>

  <div className="bg-[#1e1f2b] border border-indigo-900 rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-md text-gray-100">
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="text-indigo-400 text-5xl">🏛️</div>
      <h1 className="text-2xl font-bold uppercase tracking-wide">
        Portal dos Deuses
      </h1>
      <p className="text-sm text-gray-400 text-center tracking-wide">
        Insira suas credenciais divinas para acessar seu reino financeiro.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {!isLogin && (
        <div>
          <label className="block text-sm font-semibold  text-gray-300">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Seu nome completo"
            className="mt-1 w-full px-4 py-2 bg-[#2c2d3c] border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300">Email dos Deuses</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="seuemail@olympus.com"
          className="mt-1 w-full px-4 py-2 bg-[#2c2d3c] border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300">Senha Secreta do Oráculo</label>
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
          placeholder="********"
          className="mt-1 w-full px-4 py-2 bg-[#2c2d3c] border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:opacity-90 transition duration-300 disabled:opacity-60"
      >
        {isLoading ? 'Processando...' : (isLogin ? 'Entrar no Olimpo' : 'Criar Altar Divino')}
      </button>
    </form>

    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="text-indigo-400 text-sm font-medium hover:underline transition"
      >
        {isLogin ? 'Não tem uma conta? Crie seu altar financeiro!' : 'Já tem uma conta? Acesse o Olimpo!'}
      </button>
    </div>

    {mensagem && (
      <div className={`mt-5 p-3 text-sm rounded-lg font-medium ${
        mensagem.includes('sucesso')
          ? 'bg-green-200/10 text-green-400 border border-green-400/50'
          : 'bg-red-200/10 text-red-400 border border-red-400/50'
      }`}>
        {mensagem}
      </div>
    )}
  </div>
</div>

  );
}