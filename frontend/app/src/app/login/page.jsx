"use client"

import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
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
          setTimeout(() => {
            window.location.href = '/autenticado';
          }, 2000);
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
    // <div className='h-screen flex items-center justify-center bg-[#fdf0e5]'>

    //   <div className="w-100 h-120 rounded shadow-md bg-[#db640380] grid place-items-center space-y-1">


    //     <Head>
    //       <title >{isLogin ? 'Login' : 'Cadastro'}</title>
    //     </Head>
    //     <img src="../../../app/public/banner.jpg" alt="dor" />
    //     <h1 className='text-[3vh] font-semibold font-ci'>{isLogin ? 'Login' : 'Cadastro'}</h1>

    //     <form onSubmit={handleSubmit} className='space-y-1'>
    //       {!isLogin && (
    //         <>
    //           <div>

    //             <h1>Nome</h1>
    //             <input
    //               type="text"
    //               name="nome"
    //               placeholder="Inseria seu nome completo"
    //               value={formData.nome}
    //               onChange={handleChange}
    //               required className='bg-white p-2 w-70 rounded-md'
    //             />
    //           </div>

    //           <br />
    //         </>
    //       )}

    //       <div>
    //         <h1>Email</h1>
    //         <input
    //           type="email"
    //           name="email"
    //           placeholder="Email"
    //           value={formData.email}
    //           onChange={handleChange}
    //           required className='bg-white p-2 w-70 rounded-md'
    //         />
    //       </div>

    //       <br />

    //       <div>
    //         <h1>Senha</h1>
    //         <input
    //           type="password"
    //           name="senha"
    //           placeholder="Senha"
    //           value={formData.senha}
    //           onChange={handleChange}
    //           required className='bg-white p-2 w-70 rounded-md'
    //         />
    //       </div>
    //       <br />

    //       <div className='flex justify-center'>
    //       <button type="submit" disabled={isLoading} className='bg-[#db640380] p-2'>
    //         {isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
    //       </button>
    //       </div>
    //     </form>

    //       <button
    //         type="button"
    //         onClick={() => setIsLogin(!isLogin)}
    //         className="rounded-md"
    //       >
    //         {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
    //       </button>

    //     {mensagem && (
    //       <div className={`mensagem ${mensagem.includes('sucesso') ? 'success' : 'error'}`}>
    //         {mensagem}
    //       </div>
    //     )}



    //   </div>
    // </div>

    //ChatGPT   -- Estou muito cansado e com muita dor, apenas vim porque não tive escolha
    <div className="min-h-screen flex items-center justify-center bg-[#fefaf6] bg-[url('/pattern.svg')]">
    <Head>
      <title>{isLogin ? 'Login' : 'Cadastro'}</title>
    </Head>

    <div className="bg-[#fffaf4] border border-orange-200 rounded-xl shadow-md p-8 w-full max-w-md text-center">
      <div className="flex flex-col items-center gap-3 mb-4">
        <div className="text-orange-600 text-4xl">
          🏛️
        </div>
        <h1 className="text-xl font-bold text-gray-800 uppercase">Portal dos Deuses</h1>
        <p className="text-sm text-gray-600">Insira suas credenciais divinas para acessar seu reino financeiro.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Seu nome completo"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Email dos Deuses</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="seuemail@olympus.com"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Senha Secreta do Oráculo</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            placeholder="********"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition duration-200"
        >
          {isLoading ? 'Processando...' : (isLogin ? 'Entrar no Olimpo' : 'Criar Altar Divino')}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-orange-600 text-sm hover:underline"
        >
          {isLogin ? 'Não tem uma conta? Crie seu altar financeiro!' : 'Já tem uma conta? Acesse o Olimpo!'}
        </button>
      </div>

      {mensagem && (
        <div className={`mt-4 p-2 text-sm rounded-md ${mensagem.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {mensagem}
        </div>
      )}
    </div>
  </div>


  );
}