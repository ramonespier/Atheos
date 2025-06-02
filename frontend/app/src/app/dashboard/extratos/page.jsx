"use client"
import { useEffect, useState } from "react";
import Sidebar from '../../components/DashBoard/Sidebar'
import Header from '../../components/DashBoard/Header'
import Footer from '../../components/DashBoard/Footer.jsx'
import { useRouter } from "next/navigation";

export default function Extratos() {
  const router = useRouter()
  const [usuario, setUsuario] = useState({});
  const [transferencias, setTransferencias] = useState([]);
  const [erro, setErro] = useState(null);
  const [editTransferencia, setEditTransferencia] = useState(null); // transferencia para editar
  const [mostrarEditor, setMostrarEditor] = useState(false); // controlar modal

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
        router.push('/login');
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
      const valor = dados.valor.toString();

      if (valor.length > 10) {
        setErro('O valor não pode exceder 10 caracteres.');
        return;
      }

      const partes = valor.split('.');
      if (partes.length > 1 && partes[1].length > 2) {
        throw new Error('Use no maximo 2 casas decimais');
      }

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
      setErro(null);
    } catch (error) {
      setErro('Erro na transferência: ' + error);
    }
  };

  const excluirTransferencia = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const resposta = await fetch(`http://localhost:3001/usuario/dashboard/extratos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!resposta.ok) throw new Error('Erro ao excluir transferência');

      setTransferencias(prev => prev.filter(transf => transf.id !== id));
    } catch (error) {
      setErro(error.message);
    }
  };

  const abrirModalEdicao = (transferencia) => {
    setEditTransferencia(transferencia);
    setMostrarEditor(true);
  };

  const fecharModalEdicao = () => {
    setEditTransferencia(null);
    setMostrarEditor(false);
  };

  const editarTransferencia = async (evento) => {
    evento.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData(evento.target);
      const dados = Object.fromEntries(formData);
      const valor = dados.valor.toString();

      if (valor.length > 10) {
        setErro('O valor não pode exceder 10 caracteres.');
        return;
      }

      const partes = valor.split('.');
      if (partes.length > 1 && partes[1].length > 2) {
        throw new Error('Use no máximo 2 casas decimais');
      }

      const resposta = await fetch(`http://localhost:3001/usuario/dashboard/extratos/${editTransferencia.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) throw new Error('Erro ao editar transferência');

      // carrega transferências atualizadas
      await buscarTransferencias();
      fecharModalEdicao();
      setErro(null);
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
              <label htmlFor="nome" className="block text-white mb-2">Destinatário:</label>
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
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
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
                maxLength={250}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded h-[160px]"
                placeholder="Digite até 250 caracteres"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Adicionar Transferência
            </button>
          </form>

          {mostrarEditor && editTransferencia && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 backdrop-blur-lg"></div>

              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-white mb-4">Editar Transferência</h2>

                  <form onSubmit={editarTransferencia}>
                    <div className="mb-4">
                      <label htmlFor="edit-nome" className="block text-white mb-2">Destinatário:</label>
                      <input
                        type="text"
                        id="edit-nome"
                        name="nome"
                        required
                        defaultValue={editTransferencia.nome}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="edit-tipo" className="block text-white mb-2">Tipo:</label>
                      <select
                        name="tipo"
                        id="edit-tipo"
                        defaultValue={editTransferencia.tipo}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                      >
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="edit-valor" className="block text-white mb-2">Valor (R$):</label>
                      <input
                        type="number"
                        name="valor"
                        id="edit-valor"
                        step="0.01"
                        min="0"
                        required
                        defaultValue={editTransferencia.valor}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="edit-descricao" className="block text-white mb-2">Descrição:</label>
                      <textarea
                        name="descricao"
                        id="edit-descricao"
                        rows="3"
                        maxLength={250}
                        defaultValue={editTransferencia.descricao}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded h-[160px]"
                        placeholder="Digite até 250 caracteres"
                      ></textarea>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={fecharModalEdicao}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

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
              <div className="flex flex-col">
                {transferencias.map((transf) => (
                  <div key={`${transf.id}`} className="border p-4 rounded bg-gray-800 text-white mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-lg">{transf.nome}</span>
                      <span className={`font-bold text-lg ${transf.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                        {transf.tipo === 'entrada' ? '+' : '-'} R$ {transf.valor}
                      </span>
                    </div>

                    <div className="flex justify-between items-end">
                      <p className="text-gray-300 break-words w-2/3 mb-3">{transf.descricao}</p>
                      <div className="flex flex-col gap-5 relative">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                          onClick={() => excluirTransferencia(transf.id)}
                        >
                          EXCLUIR
                        </button>
                        <button
                          className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded text-sm"
                          onClick={() => abrirModalEdicao(transf)}
                        >
                          EDITAR
                        </button>
                      </div>
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