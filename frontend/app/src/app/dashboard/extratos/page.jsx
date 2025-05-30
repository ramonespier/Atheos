"use client"
import { useEffect, useState } from "react";
import Sidebar from '../../components/DashBoard/Sidebar'
import Header from '../../components/DashBoard/Header'
import Footer from '../../components/DashBoard/Footer.jsx'

export default function Extratos() {
  const [usuario, setUsuario] = useState({});
  const [transferencias, setTransferencias] = useState([]);
  const [erro, setErro] = useState(null);

  const buscarTransferencias = async () => {
    const token = localStorage.getItem('token');

    try {
      const resposta = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!resposta.ok) throw new Error('Erro ao carregar transferências');

      const dadosTransferencias = await resposta.json();
      setTransferencias(dadosTransferencias);
    } catch (error) {
      setErro(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const buscarUsuario = async () => {
      try {
        const resposta = await fetch('http://localhost:3001/usuario/autenticado', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!resposta.ok) throw new Error('Não autenticado');

        const dadosUsuario = await resposta.json();
        setUsuario(dadosUsuario);
        await buscarTransferencias();
      } catch (error) {
        setErro(error.message);
        window.location.href = '/login';
      }
    };

    buscarUsuario();
  }, []);

  const adicionarTransferencia = async (evento) => {
    evento.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData(evento.target);
      const dados = Object.fromEntries(formData);

      const resposta = await fetch('http://localhost:3001/usuario/dashboard/extratos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) throw new Error('Erro ao adicionar transferência');

      await buscarTransferencias();
      evento.target.reset();
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="flex font-minhaFonte bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 min-h-screen flex flex-col">
        <Header />

        <div className="p-8 space-y-10">
          <form 
            onSubmit={adicionarTransferencia} 
            className="bg-slate-900/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-800 max-w-lg mx-auto"
          >
            <h2 className="text-2xl font-extrabold mb-6 tracking-wide bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Nova Transferência
            </h2>

            <div className="mb-6">
              <label htmlFor="nome" className="block mb-2 text-sm uppercase tracking-wider">Nome:</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                required
                className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="tipo" className="block mb-2 text-sm uppercase tracking-wider">Tipo:</label>
              <select 
                name="tipo" 
                id="tipo"
                className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="valor" className="block mb-2 text-sm uppercase tracking-wider">Valor (R$):</label>
              <input 
                type="number" 
                name="valor" 
                id="valor" 
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="descricao" className="block mb-2 text-sm uppercase tracking-wider">Descrição:</label>
              <textarea 
                name="descricao" 
                id="descricao"
                rows="3"
                className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 hover:brightness-125 text-black font-bold py-3 rounded-xl uppercase tracking-wide transition duration-300"
            >
              Adicionar
            </button>
          </form>

          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-6 tracking-wide bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Histórico de Transferências
            </h2>

            {erro && (
              <div className="bg-red-500 text-white p-4 rounded-xl mb-6">
                Erro: {erro}
              </div>
            )}

            {transferencias.length === 0 ? (
              <div className="text-gray-400">Nenhuma transferência encontrada</div>
            ) : (
              <div className="space-y-4">
                {transferencias.map((transf) => (
                  <div 
                    key={`${transf.id}`} 
                    className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-lg border border-gray-800 hover:border-orange-400 transition duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg">{transf.nome}</span>
                      <span className={`font-bold text-lg ${
                        transf.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transf.tipo === 'entrada' ? '+' : '-'} R$ {transf.valor}
                      </span>
                    </div>

                    <div className="flex justify-between items-end text-sm text-gray-400">
                      <p className="pr-4">{transf.descricao}</p>
                      <p>
                        {new Date(transf.data).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
