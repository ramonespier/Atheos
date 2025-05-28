"use client"

import Sidebar from '../../components/DashBoard/Sidebar'
import Header from '../../components/DashBoard/Header'
import Footer from '../../components/DashBoard/Footer.jsx'
import { useEffect, useState } from "react";

export default function Extratos() {
  const [usuario, setUsuario] = useState([]);
  const [transferencias, setTransferencias] = useState([]); // Alterado para array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const backendUrl = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:3001`;

  // Carrega as transferências ao montar o componente
  const fetchTransferencias = async () => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/usuario/dashboard/extratos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Falha ao carregar transferências');
      
      const data = await response.json();
      setTransferencias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Carrega dados do usuário
    fetch(`${backendUrl}/usuario/autenticado`, {
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
        // Carrega transferências após autenticação
        fetchTransferencias();
      })
      .catch(err => {
        console.error('Erro:', err);
        window.location.href = '/login';
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const token = localStorage.getItem('token');

    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/usuario/dashboard/extratos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      
      if (!response.ok) throw new Error('Falha ao cadastrar transferência');
      
      const novaTransferencia = await response.json();
      
      // Atualiza a lista de transferências com a nova
      setTransferencias(prev => [novaTransferencia, ...prev]);
      
      // Reseta o formulário
      event.target.reset();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!usuario) {
    return <div className="text-white p-4">Carregando...</div>;
  }

  return (
    <div className="flex font-minhaFonte">
      <Sidebar />
      <main className="flex-1 bg-[#121210] min-h-screen flex flex-col">
        <Header />

        <div className="p-6 space-y-6">
          {/* Formulário de Transferência */}
          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
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
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-800"
            >
              {isLoading ? 'Enviando...' : 'Adicionar Transferência'}
            </button>
          </form>

          {/* Lista de Transferências */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Histórico de Transferências</h2>
            
            {error && (
              <div className="bg-red-800 text-white p-3 rounded mb-4">
                Erro: {error}
              </div>
            )}

            {isLoading && transferencias.length === 0 ? (
              <div className="text-white">Carregando transferências...</div>
            ) : transferencias.length === 0 ? (
              <div className="text-white">Nenhuma transferência encontrada</div>
            ) : (
              <div className="space-y-3">
                {transferencias.map((transf) => (
                  <div key={transf.id} className="border p-4 rounded bg-gray-800 text-white">
                    <div className="flex justify-between">
                      <span className="font-semibold">{transf.nome}</span>
                      <span className={`font-bold ${
                        transf.tipo === 'Entrada' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transf.tipo === 'Entrada' ? '+' : '-'} R$ {transf.valor?.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">{transf.descricao}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(transf.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
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