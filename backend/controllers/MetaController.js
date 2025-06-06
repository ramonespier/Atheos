import { readAll } from "../config/database.js";
import { adicionarMetas, atualizarMetas, excluirMetas } from "../models/Meta.js";

const metaController = async (req, res) => {
    try {
        const meta = await readAll ('view_metas', `usuario_id = ${req.usuarioId}`)

        if (!meta) {
            return res.status(404).json({message: 'Meta não encontrada para este usuário'})
        }

        res.status(200).json(meta)
    } catch (err) {
        console.error('Erro no controller de busca de meta do usuário.', err)
        res.status(500).json({err: 'Erro ao buscar a meta do usuário.', err})
    }
}

const adicionarMetasController = async (req, res) => { 
    try { 
        const { nome, valor_limite, mes, ano } = req.body;
        const metaData = { 
            nome: nome,
            valor_limite: valor_limite,
            mes: mes,
            ano: ano,
            usuario_id: req.usuarioId
        }
        
        await adicionarMetas(metaData);
        res.status(201).json({message: 'Meta adicionada com sucesso!'})
    } catch (err) { 
        console.error('Erro ao adicionar meta' , err)
        res.status(500).json({message: 'Erro ao adicionar meta', err})
    }
}

const atualizarMetasController = async (req, res) => {
    try {
        const metaId = req.params.id;
        const { nome, valor_limite, mes, ano } = req.body;
        const metaData = {
            nome: nome,
            valor_limite: valor_limite,
            mes: mes,
            ano: ano
        }
        await atualizarMetas(metaId, metaData);
        res.status(200).json({message: 'Sucesso ao atualizar a meta: ', metaId})
    } catch (err) {
        console.error('Erro ao atualizar o meta', err)
        res.status(500).json({message: 'Erro ao atualizar  o meta: ', err})
    }
}

const excluirMetasController = async (req, res) => {
    try {
        const metaId = req.params.id
        await excluirMetas(metaId)
        res.status(200). json({message: 'Meta excluida com sucesso!', metaId})
    } catch (err) {
        console.error('Erro ao excluir meta', err)
        res.status(500).json({message: 'Erro ao excluir meta', err})
    }
}

export { metaController, adicionarMetasController, atualizarMetasController, excluirMetasController }