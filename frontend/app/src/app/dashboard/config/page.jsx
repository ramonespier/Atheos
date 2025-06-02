"use client";
import { useEffect, useState } from 'react';
import validator from 'validator';
import { useRouter } from 'next/navigation.js';
import Sidebar from '../../components/DashBoard/Sidebar.jsx';
import Header from '../../components/DashBoard/Header.jsx';
import Footer from '../../components/DashBoard/Footer.jsx';

export default function Config() {
  const router = useRouter();
  const [isPut, setIsPut] = useState(true);
  const [usuario, setUsuario] = useState([]);
  const [formData, setFormData] = useState(
    {
      nome: "",
      email: ""
    }
  );
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:3001/usuario/autenticado', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Falha na autenticação');
      return res.json();
    })
    .then(data => {
      setUsuario(data);
      // Atualiza o formData com o email do usuário
      setFormData(prev => ({
        ...prev,
        email: data.email
      }));
    })
    .catch(err => {
      console.error('Erro:', err);
      router.push('/login');
    });
  }, []);

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
    setMensagem("");

    if (!validarNome(formData.nome)) {
      setMensagem("O nome não deve conter números ou caracteres especiais.");
      setIsLoading(false);
      return;
    }

    if (!validarEmail(formData.email)) {
      setMensagem("Email inválido.");
      setIsLoading(false);
      return;
    }


    try {
      const response = await fetch("http://localhost:3001/usuario/dashboard/config/:id", {
        method: "PUT", // <-- Corrigido
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Alterações salvas com sucesso.");
      } else {
        setMensagem(data.err || "Erro ao salvar alterações.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setMensagem("Erro na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex font-minhaFonte">
      <Sidebar />
      <main className="flex-1 bg-[#121210] min-h-screen flex flex-col">
        <Header />

        <div className='p-4 flex-1'>
          <div className="max-w-md mx-auto bg-[#050f24] text-white p-6 rounded-lg shadow-md border border-[#0a0a0a]">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-orange-500 text-xl">👤</span>
                <h2 className="text-2xl font-bold">Perfil</h2>
              </div>
              <p className="text-sm text-gray-300">Gerencie suas informações pessoais</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={usuario.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-2 rounded-md bg-black text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"

                  id="nome"
                  name="nome"
                  placeholder={usuario.nome}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 rounded-md bg-black text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>

              {mensagem && (
                <p className="mt-2 text-sm text-center text-orange-400">{mensagem}</p>
              )}
            </form>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
