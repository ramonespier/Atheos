"use client";

import { useState } from "react";
import Head from "next/head";
import { FiArrowUp } from "react-icons/fi";
import validator from 'validator';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    nome: "",
    confirmar: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function validarNome(nome) {
    return /^[A-Za-zÀ-ú\s]+$/.test(nome);
  }

  function validarEmail(email) {
    return validator.isEmail(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLogin) {
      if (!validarNome(formData.nome)) {
        toast.error("O nome não deve conter números ou caracteres especiais.");
        setIsLoading(false);
        return;
      }
    }

    if (!validarEmail(formData.email)) {
      toast.error('Email inválido');
      setIsLoading(false);
      return;
    }

    if (!isLogin && formData.senha !== formData.confirmar) {
      toast.error("As senhas não coincidem, tente novamente.");
      setIsLoading(false);
      return;
    }

    if (!isLogin && formData.senha.length < 6) {
      toast.error('A senha deve conter no mínimo 6 caracteres, crie uma senha maior');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/usuario/login" : "/usuario/cadastro";
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(isLogin ? "Login realizado com sucesso! Entrando no olimpo..." : "Cadastro realizado com sucesso! Faça seu login!");

        if (isLogin && data.token) {
          localStorage.setItem("token", data.token);
          console.log(data.token);
          setTimeout(() => {
            router.push("/dashboard");
          }, 600);
        }
        if (!isLogin) {
          setFormData({
            email: "",
            senha: "",
            nome: "",
            confirmar: ""
          });
        }
      } else {
        toast.error(data.err || `Erro no ${isLogin ? "login" : "cadastro"}`);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      toast.error("Erro na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-all duration-1000">
      <Head>
        <title>{isLogin ? "Login" : "Cadastro"} | Portal dos Deuses</title>
        <meta name="theme-color" content="#111827" />
      </Head>

      <Toaster
        position="top-center"
        toastOptions={{
          className: 'mt-4 p-3 text-lg rounded-lg bg-red-600/50 text-red-100 animate-pulse',
          success: {
            className: 'mt-4 p-3 text-lg rounded-lg bg-green-600/20 text-green-200 animate-pulse'
          }
        }}
      />

      <div
        className={`relative border rounded-3xl shadow-2xl p-10 w-full max-w-md text-center backdrop-blur-x5 transition-all duration-700
          ${isLogin
            ? "bg-gradient-to-br from-black via-black/90 to-orange-900 border-gray-800 hover:shadow-orange-500/30"
            : "bg-gradient-to-br from-black via-black/35 to-orange-900 border-orange-700 hover:shadow-white/30 scale-[1.03]"
          }`}
      >
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-700 p-3 rounded-full shadow-lg animate-pulse">
          <span className="text-white text-2xl">🏛️</span>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-white uppercase tracking-widest transition-all duration-500">
          {isLogin ? "Portal dos Deuses" : "Crie Seu Altar"}
        </h1>
        <p className="mt-2 text-sm text-gray-400 transition-all duration-500">
          {isLogin
            ? "Insira suas credenciais divinas para acessar seu reino financeiro."
            : "Cadastre-se e erga seu altar divino no Olimpo."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {!isLogin && (
            <div className="text-left animate-fade-in-down">
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className="input-field p-2 w-full rounded-lg border border-neutral-400/30"
              />
            </div>
          )}

          <div className="text-left animate-fade-in-down">
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Email dos Deuses
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@olympus.com"
              className="input-field p-2 w-full rounded-lg border border-neutral-400/30"
            />
          </div>

          <div className="text-left animate-fade-in-down">
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Senha Secreta do Oráculo
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="********"
              className="input-field p-2 w-full rounded-lg border border-neutral-400/30"
            />
          </div>

          {!isLogin && (
            <div className="text-left animate-fade-in-down">
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Confirme sua senha
              </label>
              <input
                type="password"
                name="confirmar"
                value={formData.confirmar}
                onChange={handleChange}
                placeholder="********"
                className="input-field p-2 w-full rounded-lg border border-neutral-400/30"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="submit-button animate-bounce"
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

        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
          <div className="relative">
            <button
              onClick={() => setIsLogin(!isLogin)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`group bg-gradient-to-r from-orange-500 to-orange-700 p-3 rounded-full shadow-lg transition-all duration-500 hover:rotate-180 hover:scale-125 ${isLogin ? "" : "rotate-90"
                }`}
            >
              <FiArrowUp
                className={`text-white text-xl transition-transform duration-500 ${!isLogin ? "rotate-90" : "rotate-0"
                  }`}
              />
            </button>

            {showTooltip && (
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3">
                <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  Faça cadastro!
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-orange-700"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }

        .input-field {
          @apply mt-1 w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300;
        }

        .submit-button {
          @apply w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-2 px-4 rounded-md shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
        }
      `}</style>
    </div>
  );
}
