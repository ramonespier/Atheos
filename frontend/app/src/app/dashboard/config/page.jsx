"use client";
import { useEffect, useState } from 'react';
import validator from 'validator';
import { useRouter } from 'next/navigation.js';
import Sidebar from '../../components/DashBoard/Sidebar.jsx';
import Header from '../../components/DashBoard/Header.jsx';
import Footer from '../../components/DashBoard/Footer.jsx';
import { motion } from 'framer-motion';

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
      setMensagem('A senha deve conter no mínimo 6 caracteres.');
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
    <div className="flex font-sans">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-black via-[#0a0a0a] to-[#121212] min-h-screen flex flex-col">
        <Header />
        <motion.div 
          className='p-6 flex-1 flex items-center justify-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="w-full max-w-lg bg-[#0f0f0f] text-white p-8 rounded-3xl shadow-xl border border-[#1f1f1f] backdrop-blur-md"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-3xl">👤</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Perfil</h2>
              </div>
              <button
                type="button"
                onClick={toggleEditMode}
                className={`px-5 py-2 rounded-xl font-semibold shadow-inner ${
                  editMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500'
                } text-black transition-all duration-300`}
              >
                {editMode ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-6">Gerencie suas informações pessoais com segurança.</p>

            <form className="space-y-6" onSubmit={editarPerfil}>
              {['nome', 'email', 'senha', 'confirma'].map((field, idx) => (
                <motion.div 
                  key={field}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <label htmlFor={field} className="block text-sm font-medium mb-1 capitalize">{field === 'confirma' ? 'Confirme a senha' : field}</label>
                  <input
                    type={field.includes('senha') ? 'password' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder={editMode && field.includes('senha') ? '••••••••' : ''}
                    className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 focus:outline-none focus:ring-4 focus:ring-orange-500 disabled:bg-gray-900 disabled:text-gray-500 transition-all duration-200"
                  />
                </motion.div>
              ))}

              {editMode && (
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 mt-4 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </motion.button>
              )}

              {mensagem && (
                <motion.p
                  className={`mt-4 text-center text-sm font-medium ${
                    mensagem.includes("sucesso") ? "text-green-400" : "text-red-400"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {mensagem}
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>
        <Footer />
      </main>
    </div>
  );
}
