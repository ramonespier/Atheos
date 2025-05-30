"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from '../../components/DashBoard/Sidebar';
import Header from '../../components/DashBoard/Header';
import Footer from '../../components/DashBoard/Footer.jsx';

// Pequeno CSS extra direto no arquivo, só pra sombra no texto
const extraStyles = `
  .text-glow {
    text-shadow:
      0 0 8px rgba(59, 130, 246, 0.7),
      0 0 12px rgba(59, 130, 246, 0.5);
  }
`;

function TransferenciaForm({ onAdd, loading }) {
  const [erroLocal, setErroLocal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroLocal(null);

    const formData = new FormData(e.target);
    const dados = Object.fromEntries(formData);
    const valor = dados.valor.toString();

    if (valor.length > 10) {
      setErroLocal("Valor não pode ter mais que 10 caracteres, mano.");
      return;
    }

    await onAdd(dados);
    e.target.reset();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-8 rounded-xl shadow-2xl max-w-lg mx-auto"
    >
      <h2 className="text-3xl font-extrabold text-white mb-8 text-center text-glow">
        Nova Transferência
      </h2>

      {erroLocal && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-700 text-white p-3 rounded mb-6 font-semibold text-center shadow-inner"
        >
          {erroLocal}
        </motion.p>
      )}

      <label htmlFor="nome" className="block mb-2 text-white font-semibold tracking-wide">
        Nome
      </label>
      <input
        type="text"
        id="nome"
        name="nome"
        required
        placeholder="Digite o nome"
        className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 shadow-md transition"
      />

      <label htmlFor="tipo" className="block mb-2 text-white font-semibold tracking-wide">
        Tipo
      </label>
      <select
        name="tipo"
        id="tipo"
        defaultValue="entrada"
        className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 shadow-md transition"
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <label htmlFor="valor" className="block mb-2 text-white font-semibold tracking-wide">
        Valor (R$)
      </label>
      <input
        type="number"
        id="valor"
        name="valor"
        step="0.01"
        min="0"
        required
        placeholder="0,00"
        className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 shadow-md transition"
      />

      <label htmlFor="descricao" className="block mb-2 text-white font-semibold tracking-wide">
        Descrição
      </label>
      <textarea
        id="descricao"
        name="descricao"
        rows="4"
        maxLength={250}
        placeholder="Até 250 caracteres"
        className="w-full mb-8 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-4 focus:ring-indigo-500 shadow-md transition"
      />

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: loading ? 1 : 0.95 }}
        className={`w-full py-4 font-bold rounded-xl text-white shadow-lg 
          transition-colors duration-300 
          ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      >
        {loading ? "Salvando..." : "Adicionar Transferência"}
      </motion.button>
    </motion.form>
  );
}

function TransferenciasLista({ transferencias, onExcluir, erro, loading }) {
  return (
    <section className="max-w-6xl mx-auto mt-12 px-6 sm:px-0">
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center text-glow">
        Histórico de Transferências
      </h2>

      {erro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-800 text-white p-4 rounded mb-8 text-center font-semibold shadow-lg"
        >
          Erro: {erro}
        </motion.div>
      )}

      {loading ? (
        <p className="text-white text-center text-xl font-semibold animate-pulse">
          Carregando transferências...
        </p>
      ) : transferencias.length === 0 ? (
        <p className="text-white text-center text-xl font-semibold">
          Nenhuma transferência encontrada.
        </p>
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="space-y-6"
        >
          <AnimatePresence>
            {transferencias.map((transf) => (
              <motion.li
                key={transf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                layout
                className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
              >
                <div className="flex flex-col gap-1 max-w-lg">
                  <h3 className="text-2xl font-bold text-white">{transf.nome}</h3>
                  <p className="text-gray-300 break-words">{transf.descricao}</p>
                  <time
                    className="text-gray-400 text-sm"
                    dateTime={transf.data}
                    title={new Date(transf.data).toLocaleString()}
                  >
                    {new Date(transf.data).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>

                <div className="flex items-center gap-6 justify-end min-w-[190px]">
                  <span
                    className={`text-3xl font-extrabold select-none ${
                      transf.tipo === 'entrada' ? 'text-green-400' : 'text-red-500'
                    }`}
                  >
                    {transf.tipo === 'entrada' ? '+' : '-'} R$ {transf.valor}
                  </span>

                  <motion.button
                    onClick={() => onExcluir(transf.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded-xl font-bold shadow-lg transition-colors"
                    aria-label={`Excluir transferência ${transf.nome}`}
                    title="Excluir transferência"
                  >
                    EXCLUIR
                  </motion.button>

                  <motion.button
                    disabled
                    className="bg-gray-700 cursor-not-allowed text-white px-5 py-3 rounded-xl font-bold opacity-50"
                    title="Em desenvolvimento"
                    aria-label={`Editar transferência ${transf.nome}`}
                  >
                    EDITAR
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
}

export default function Extratos() {
  const [usuario, setUsuario] = useState(null);
  const [transferencias, setTransferencias] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    async function fetchDados() {
      setLoading(true);
      setErro(null);

      try {
        const respUser = await fetch('http://localhost:3001/usuario/autenticado', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!respUser.ok) throw new Error("Não autenticado");

        const userData = await respUser.json();
        setUsuario(userData);

        const respTransf = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!respTransf.ok) throw new Error("Erro ao carregar transferências");

        const transfData = await respTransf.json();
        setTransferencias(transfData);
      } catch (error) {
        setErro(error.message);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    }

    fetchDados();
  }, [token]);

  async function handleAddTransferencia(dados) {
    setAddLoading(true);
    setErro(null);

    try {
      const resp = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!resp.ok) throw new Error('Erro ao adicionar transferência');

      const respAtualizada = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const novaLista = await respAtualizada.json();
      setTransferencias(novaLista);
    } catch (error) {
      setErro(error.message);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleExcluir(id) {
    setErro(null);

    try {
      const resp = await fetch(`http://localhost:3001/usuario/dashboard/extratos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (!resp.ok) throw new Error('Erro ao excluir transferência');

      setTransferencias((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <>
      <style>{extraStyles}</style>
      <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-black font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header usuario={usuario} />
          <main className="flex-grow overflow-y-auto py-10 px-4 sm:px-12">
            <TransferenciaForm onAdd={handleAddTransferencia} loading={addLoading} />
            <TransferenciasLista
              transferencias={transferencias}
              onExcluir={handleExcluir}
              erro={erro}
              loading={loading}
            />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
