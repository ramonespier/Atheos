import { readAll } from "../config/database.js";
import { adicionarTransacao, atualizarTransacao, excluirTransacao } from "../models/Transacao.js";

const transacaoController = async (req, res) => {
    try {
        const transacao = await readAll('view_transacoes_por_usuario', `usuario_id = ${req.usurioId}`)

        if (!transacao) {
            return res.status(404).json({ message: 'Transação não encontrada para este usuário' })
        }

        res.status(200).json(transacao)
    } catch (err) {
        console.error('Erro no controller ao buscar a transação do usuário.', err)
        res.status(500).json({ err: 'Erro ao buscar a transação do usuário.', err })
    }
}

const adicionarTransacaoController = async (req, res) => {
    try {
        const { tipo, valor, descricao } = req.body;

        const transacaoData = {
            tipo: tipo,
            valor: valor,
            descricao: descricao,
            usurio_id: req.usuarioId
        };

        const transacaoId = await adicionarTransacao(transacaoData);
        res.status(201).json({ message: 'Transação adicionada com sucesso!' })
    } catch (err) {
        console.error('Erro ao adicionar transação', err)
        res.status(500).json({ message: 'Erro ao adicinar transação', err })
    }
}


const atualizarTransacaoController = async (req, res) => {
    try {
        const transacaoId = req.params.id;
        const { tipo, valor, descricao } = req.body;
        const transacaoData = {
            tipo: tipo,
            valor: valor,
            descricao: descricao
        }
        await atualizarTransacao(transacaoId, transacaoData);
        res.status(200).json({ message: 'Transção atualizada com sucesso!', transacaoId })
    } catch (err) {
        console.error('Erro ao atualizar a transação', err)
        res.status(500).json({ message: 'Erro ao atualizar a transação: ', err })
    }
}

const excluirTransacaoController = async (req, res) => {
    try {
        const transacaoId = req.params.id;
        await excluirTransacao(transacaoId)
        res.status(200).json({ message: 'Transação excluida com sucesso!', transacaoId })
    } catch (err) {
        console.error('Erro ao excluir transação', err);
        res.status(500).json({ message: 'Erro ao excluir transação', err })
    }
}

export { transacaoController, adicionarTransacaoController, atualizarTransacaoController, excluirTransacaoController }