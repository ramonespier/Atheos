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
            window.location.href = '/dashboard'; //link para o dash
          }, 600); 
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
    
    <div className="flex items-center justify-center w-screen h-screen">
    <Head>
      <title>{isLogin ? 'Login' : 'Cadastro'}</title>
    </Head>

    <div className="text-center bg-gradient-to-r from-blue-500 via-black to-blue-100 h-80 p-2">
      <div className="flex flex-col ">
        <div className="py-1">
          🏛️
        </div>
        <h1 className="py-1">Portal dos Deuses</h1>
        <p className="py-1">Insira suas credenciais divinas para acessar seu reino financeiro.</p>
      </div>

      <form onSubmit={handleSubmit} className="">
        {!isLogin && (
          <div>
            <label className="">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Seu nome completo"
              className=""
            />
          </div>
        )}

        <div>
          <label className="">Email dos Deuses</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="seuemail@olympus.com"
            className=""
          />
        </div>

        <div>
          <label className="">Senha Secreta do Oráculo</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            placeholder="********"
            className=""
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className=""
        >
          {isLoading ? 'Processando...' : (isLogin ? 'Entrar no Olimpo' : 'Criar Altar Divino')}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className=""
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





// <div className="min-h-screen flex items-center justify-center bg-[#fefaf6] bg-[url('/pattern.svg')]">
//     <Head>
//       <title>{isLogin ? 'Login' : 'Cadastro'}</title>
//     </Head>

//     <div className="bg-[#fffaf4] border border-orange-200 rounded-xl shadow-md p-8 w-full max-w-md text-center">
//       <div className="flex flex-col items-center gap-3 mb-4">
//         <div className="text-orange-600 text-4xl">
//           🏛️
//         </div>
//         <h1 className="text-xl font-bold text-gray-800 uppercase">Portal dos Deuses</h1>
//         <p className="text-sm text-gray-600">Insira suas credenciais divinas para acessar seu reino financeiro.</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4 text-left">
//         {!isLogin && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Nome</label>
//             <input
//               type="text"
//               name="nome"
//               value={formData.nome}
//               onChange={handleChange}
//               required
//               placeholder="Seu nome completo"
//               className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400"
//             />
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email dos Deuses</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             placeholder="seuemail@olympus.com"
//             className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Senha Secreta do Oráculo</label>
//           <input
//             type="password"
//             name="senha"
//             value={formData.senha}
//             onChange={handleChange}
//             required
//             placeholder="********"
//             className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition duration-200"
//         >
//           {isLoading ? 'Processando...' : (isLogin ? 'Entrar no Olimpo' : 'Criar Altar Divino')}
//         </button>
//       </form>

//       <div className="mt-4">
//         <button
//           type="button"
//           onClick={() => setIsLogin(!isLogin)}
//           className="text-orange-600 text-sm hover:underline"
//         >
//           {isLogin ? 'Não tem uma conta? Crie seu altar financeiro!' : 'Já tem uma conta? Acesse o Olimpo!'}
//         </button>
//       </div>

//       {mensagem && (
//         <div className={`mt-4 p-2 text-sm rounded-md ${mensagem.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//           {mensagem}
//         </div>
//       )}
//     </div>
//   </div>