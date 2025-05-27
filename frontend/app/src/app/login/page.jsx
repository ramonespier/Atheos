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
          console.log(data.token)
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
;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Head>
        <title>{isLogin ? 'Login' : 'Cadastro'}</title>
        <meta name="theme-color" content="#111827" />
      </Head>

      <div className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 rounded-xl shadow-lg p-8 w-full max-w-md text-center transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="text-orange-500 dark:text-orange-400 text-4xl transition-transform duration-300 hover:scale-110">
            🏛️
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase tracking-wider">
            Portal dos Deuses
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Insira suas credenciais divinas para acessar seu reino financeiro.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Seu nome completo"
                className="input-field"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email dos Deuses
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seuemail@olympus.com"
              className="input-field"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha Secreta do Oráculo
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="********"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : isLogin ? 'Entrar no Olimpo' : 'Criar Altar Divino'}
          </button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-600 dark:text-orange-400 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded px-2 py-1 transition-colors duration-200"
          >
            {isLogin ? 'Não tem uma conta? Crie seu altar financeiro!' : 'Já tem uma conta? Acesse o Olimpo!'}
          </button>
        </div>

        {mensagem && (
          <div className={`mt-4 p-3 text-sm rounded-md ${mensagem.includes('sucesso') 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
            {mensagem}
          </div>
        )}
      </div>

      <style jsx global>{`
        .input-field {
          @apply mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 dark:focus:border-orange-400
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                 transition duration-200 ease-in-out;
        }
        
        .submit-button {
          @apply w-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 
                 text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 
                 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                 transition duration-200 ease-in-out transform hover:scale-[1.01] active:scale-[0.99]
                 disabled:opacity-70 disabled:cursor-not-allowed;
        }
      `}</style>
    </div>
  );
}