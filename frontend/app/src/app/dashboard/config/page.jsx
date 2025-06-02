"use client";
import { useEffect, useState } from 'react';
import validator from 'validator';
import { useRouter } from 'next/navigation.js';
import Sidebar from '../../components/DashBoard/Sidebar.jsx';
import Header from '../../components/DashBoard/Header.jsx';
import Footer from '../../components/DashBoard/Footer.jsx';

export default function Config() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({});
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirma: ""
  });
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
      setFormData({
        nome: data.nome || "",
        email: data.email || "",
        senha: "",
        confirma: ""
      });
    })
    .catch(err => {
      console.error('Erro:', err);
      router.push('/login');
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarNome = (nome) => /^[A-Za-zÀ-ú\s]+$/.test(nome);
  const validarEmail = (email) => validator.isEmail(email);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      setFormData({
        nome: usuario.nome || "",
        email: usuario.email || "",
        senha: "",
        confirma: ""
      });
    }
  };

  const editarPerfil = async (e) => {
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

    if (formData.senha && formData.senha.length < 6) {
      setMensagem('A senha deve conter no mínimo 6 caracteres, crie uma senha maior');
      setIsLoading(false);
      return;
    }

    if (formData.senha && formData.senha !== formData.confirma) {
      setMensagem("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const dadosParaEnviar = {
        nome: formData.nome,
        email: formData.email,
        ...(formData.senha && { senha: formData.senha })
      };

      const response = await fetch(`http://localhost:3001/usuario/dashboard/config/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Alterações salvas com sucesso!");
        setUsuario(prev => ({ ...prev, ...dadosParaEnviar }));
        setEditMode(false);
        // limpa os campos de senha após salvar
        setFormData(prev => ({
          ...prev,
          senha: "",
          confirma: ""
        }));
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-xl">👤</span>
                <h2 className="text-2xl font-bold">Perfil</h2>
              </div>
              <button
                type="button"
                onClick={toggleEditMode}
                className={`px-4 py-2 rounded-md font-medium ${editMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-500 hover:bg-orange-600'} text-white transition-colors`}
              >
                {editMode ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>
            <p className="text-sm text-gray-300 mb-4">Gerencie suas informações pessoais</p>

            <form className="space-y-4" onSubmit={editarPerfil}>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:text-gray-400"
                />

                <label htmlFor="email" className="block text-sm font-medium mb-1 mt-4">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:text-gray-400"
                />

                <label htmlFor="senha" className="block text-sm font-medium mb-1 mt-4">Nova Senha</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder={editMode ? "Deixe em branco para não alterar" : ""}
                  className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:text-gray-400"
                />

                <label htmlFor="confirma" className="block text-sm font-medium mb-1 mt-4">Confirme a Senha</label>
                <input
                  type="password"
                  id="confirma"
                  name="confirma"
                  value={formData.confirma}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder={editMode ? "Repita a nova senha" : ""}
                  className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>

              {editMode && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              )}

              {mensagem && (
                <p className={`mt-2 text-sm text-center ${mensagem.includes("sucesso") ? "text-green-400" : "text-orange-400"}`}>
                  {mensagem}
                </p>
              )}
            </form>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}