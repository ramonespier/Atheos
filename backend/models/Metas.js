import { create, update, deleteRecord } from '../config/database.js'

const adicionarMetas = async (metasData) => {
    try {
        return await create('metas', metasData)
    } catch (err) {
        console.error('Erro ao adicionar meta', err)
        throw err;
    }
}

const atualizarMetas = async (id, metasData) => {
    try {
        return await update('metas', metasData, `id = ${id}`)
    } catch (err) {
        console.error('Erro ao atualizar metas', err)
        throw err;
    }
}

const excluirMetas = async (id) => {
    try {
        return await deleteRecord('metas', `id = ${id}`)
    } catch (err) {
        console.error('Erro ao excluir meta', err)
        throw err;
    }
}

export { adicionarMetas, atualizarMetas, excluirMetas }