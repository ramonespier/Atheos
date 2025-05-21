import { create, update, deleteRecord } from '../config/database.js';

const adicionarCategoria = async (categoriasData) => {
    try {
        return await create('categorias', categoriasData)
    } catch (err) {
        console.error('Erro ao adicionar categoria', err)
        throw err;
    }
}

const atualizarCategoria = async (id, categoriasData) => {
    try {
        return await update('categorias', categoriasData, `id = ${id}`)
    } catch (err) {
        console.error('Erro ao atualizar categoria', err)
        throw err;
    }
}

const excluirCategoria = async (id) => {
    try {
        return await deleteRecord('categorias', `id = ${id}`)
    } catch (err) {
        console.error('Erro ao excluir categoria', err)
        throw err;
    }
}

export { adicionarCategoria, 
    atualizarCategoria, 
    excluirCategoria, 
}