"use client"
import { useEffect, useState } from "react";
import Sidebar from '../../components/DashBoard/Sidebar'
import Header from '../../components/DashBoard/Header'
import Footer from '../../components/DashBoard/Footer.jsx'

export default function Extratos() {
  const [usuario, setUsuario] = useState({});
  const [transferencias, setTransferencias] = useState([]);
  const [erro, setErro] = useState(null);

  // Função fora do useEffect para poder reutilizar
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

  // Adiciona nova transferência e atualiza a lista
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

      // Recarrega transferências atualizadas
      await buscarTransferencias();
      evento.target.reset();
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="flex font-minhaFonte">
      <Sidebar />

      <main className="flex-1 bg-[#121210] min-h-screen flex flex-col">
        <Header />

        <div className="p-6 space-y-6">
          {/* Formulário de Nova Transferência */}
          <form onSubmit={adicionarTransferencia} className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Nova Transferência</h2>

            <div className="mb-4">
              <label htmlFor="nome" className="block text-white mb-2">Nome:</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="tipo" className="block text-white mb-2">Tipo:</label>
              <select 
                name="tipo" 
                id="tipo"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              >
                <option value="Entrada">Entrada</option>
                <option value="Saída">Saída</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="valor" className="block text-white mb-2">Valor (R$):</label>
              <input 
                type="number" 
                name="valor" 
                id="valor" 
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="descricao" className="block text-white mb-2">Descrição:</label>
              <textarea 
                name="descricao" 
                id="descricao"
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Adicionar Transferência
            </button>
          </form>

          {/* Lista de Transferências */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Histórico de Transferências</h2>

            {erro && (
              <div className="bg-red-800 text-white p-3 rounded mb-4">
                Erro: {erro}
              </div>
            )}

            {transferencias.length === 0 ? (
              <div className="text-white">Nenhuma transferência encontrada</div>
            ) : (
              <div className="flex flex-col-reverse">
                {transferencias.map((transf) => (
                  <div key={`${transf.id}`} className="border p-4 rounded bg-gray-800 text-white mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-lg">{transf.nome}</span>
                      <span className={`font-bold text-lg ${
                        transf.tipo === 'Entrada' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transf.tipo === 'Entrada' ? '+' : '-'} R$ {transf.valor}
                      </span>
                    </div>

                    <div className="flex justify-between items-end">
                      <p className="text-gray-300 flex-1 pr-4">{transf.descricao}</p>
                      <p className="text-sm text-gray-400">
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
