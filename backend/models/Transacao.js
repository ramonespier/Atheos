import { create, update, deleteRecord } from '../config/database.js'

const adicionarTransacao = async (transacaoData) => {
    try {
        return await create('transacoes', transacaoData)
    } catch (err) {
        console.error('Erro ao adicionar transação', err)
        throw err;
    }
}

const atualizarTransacao = async (id, transacaoData) => {
    try {
        return await update('transacoes', transacaoData, `id = ${id}`)
    } catch (err) {
        console.error('Erro ao atualizar transação', err)
        throw err;
    }
}

const excluirTransacao = async (id) => {
    try {
        return await deleteRecord('transacoes', `id = ${id}`)
    } catch (err) {
        console.error('Erro ao excluir transação', err)
        throw err;
    }
}

export { adicionarTransacao, atualizarTransacao, excluirTransacao }