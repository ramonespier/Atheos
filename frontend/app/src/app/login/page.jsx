"use client";

import { useState } from "react";
import Head from "next/head";
import { FiArrowUp } from "react-icons/fi";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    nome: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAbinha, setShowAbinha] = useState(false);

  const backendUrl = `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:3001`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem("");

    try {
      const endpoint = isLogin ? "/usuario/login" : "/usuario/cadastro";
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(isLogin ? "Login realizado com sucesso!" : "Cadastro realizado com sucesso!");

        if (isLogin && data.token) {

          localStorage.setItem('token', data.token);
          console.log(data.token)

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 600);
        }

        if (!isLogin) {
          setFormData({
            email: "",
            senha: "",
            nome: "",
          });
        }
      } else {
        setMensagem(data.err || `Erro no ${isLogin ? "login" : "cadastro"}`);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setMensagem("Erro na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };
;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Head>
        <title>{isLogin ? "Login" : "Cadastro"} | Portal dos Deuses</title>
        <meta name="theme-color" content="#111827" />
      </Head>

      <div className="relative bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center backdrop-blur-xl transition-all duration-500 hover:backdrop-blur-none hover:scale-[1.02] hover:shadow-orange-500/30">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-700 p-3 rounded-full shadow-lg">
          <span className="text-white text-2xl">🏛️</span>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-white uppercase tracking-widest">
          Portal dos Deuses
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Insira suas credenciais divinas para acessar seu reino financeiro.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {!isLogin && (
            <div className="text-left">
              <label className="block text-xs font-medium text-gray-300 mb-1">
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

          <div className="text-left">
            <label className="block text-xs font-medium text-gray-300 mb-1">
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

          <div className="text-left">
            <label className="block text-xs font-medium text-gray-300 mb-1">
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
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Processando...
              </span>
            ) : isLogin ? "Entrar no Olimpo" : "Criar Altar Divino"}
          </button>
        </form>

        {mensagem && (
          <div
            className={`mt-4 p-3 text-xs rounded-lg font-medium ${
              mensagem.includes("sucesso")
                ? "bg-green-600/20 text-green-300"
                : "bg-red-600/20 text-red-300"
            }`}
          >
            {mensagem}
          </div>
        )}

        {/* BOTÃO CIRCULAR COM SETA */}
        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
          <button
            onClick={() => {
              setShowAbinha(!showAbinha);
              setIsLogin(!isLogin);
            }}
            className="group bg-gradient-to-r from-orange-500 to-orange-700 p-3 rounded-full shadow-lg transition-transform duration-300 hover:rotate-90"
          >
            <FiArrowUp
              className={`text-white text-xl transition-transform duration-300 ${
                showAbinha ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>

          {/* ABINHA ESTILIZADA */}
          {showAbinha && (
            <div className="mt-2 ml-2 bg-gradient-to-r from-orange-500 to-orange-700 p-3 rounded-full shadow-lg text-white text-xs">
              {isLogin ? "Cadastre-se" : "Login"}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          @apply mt-1 w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300;
        }

        .submit-button {
          @apply w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-2 px-4 rounded-md shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
        }
      `}</style>

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
