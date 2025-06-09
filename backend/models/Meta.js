import { create, update, deleteRecord, read } from '../config/database.js'

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

// ESPECIFICAÇÕES PARA INVESTIMENTO ↓↓↓↓↓↓

const investirNaMeta = async (metaId, valor, usuarioId) => {

    try {

        const meta = await read('metas', `id = ${metaId} AND usuario_id = ${usuarioId}`)

        if (!meta) {
            console.error('Meta não encontrada')
        }

        const valorAtual = parseFloat(meta.valorInvestido);

        if (isNaN(valorAtual)) {
            console.error('O valor investido atual no banco de dados é inválido')
        }
        
        const novoValor = valorAtual + valor
        
        await update('metas', { valorInvestido: novoValor }, `id = ${metaId} AND usuario_id = ${usuarioId}`)

        const metaAtualizada = await read('metas', `id = ${metaId} AND usuario_id = ${usuarioId}`)

        return metaAtualizada
        
    } catch (err) {
        console.error('Erro ao investir na meta', err)
        throw err
    }
}

const retirarDaMeta = async (metaId, valor, usuarioId) => {
    try {
        
        const meta = await read('metas', `id = ${metaId} AND usuario_id = ${usuarioId}`)
        
        if (!meta) {
            console.error('Meta não encontrada')
        }
        
        const valorAtual = parseFloat(meta.valorInvestido);
        
        if (isNaN(valorAtual)) {
            console.error('O valor investido atual no banco de dados é inválido')
        }

        const valorRetirada = valor

        if (valorAtual < valorRetirada) {
            console.error('Saldo insuficiente para retirada')
        }

        const novoValor = valorAtual - valorRetirada

        await update('metas', { valorInvestido: novoValor }, `id = ${metaId} AND usuario_id = ${usuarioId}`)

        const metaAtualizada = await read('metas', `id = ${metaId} AND usuario_id = ${usuarioId}`)

        return metaAtualizada;

    } catch (err) {
        console.error('Erro ao retirar da meta', err)
        throw err
    }
}

export { adicionarMetas, atualizarMetas, excluirMetas, investirNaMeta, retirarDaMeta }