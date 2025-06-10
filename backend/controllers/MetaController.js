import { readAll } from "../config/database.js";
import { adicionarMetas, atualizarMetas, excluirMetas, investirNaMeta, retirarDaMeta } from "../models/Meta.js";

const metaController = async (req, res) => {
    try {
        const meta = await readAll('metas', `usuario_id = ${req.usuarioId}`)

        if (!meta) {
            return res.status(404).json({ message: 'Meta não encontrada para este usuário' })
        }

        res.status(200).json(meta)
    } catch (err) {
        console.error('Erro no controller de busca de meta do usuário.', err)
        res.status(500).json({ err: 'Erro ao buscar a meta do usuário.', err })
    }
}

const adicionarMetasController = async (req, res) => {
    try {
        const { nome, valorDaMeta, mes, ano } = req.body;
        const metaData = {
            nome: nome,
            valorDaMeta: valorDaMeta,
            mes: mes,
            ano: ano,
            usuario_id: req.usuarioId
        }

        await adicionarMetas(metaData);
        res.status(201).json({ message: 'Meta adicionada com sucesso!' })
    } catch (err) {
        console.error('Erro ao adicionar meta', err)
        res.status(500).json({ message: 'Erro ao adicionar meta', err })
    }
}

const atualizarMetaController = async (req, res) => {
    const metaId = req.params.id;
    const usuarioId = req.usuarioId;
    // 'operacao' e 'valor' são para investir/retirar.
    // '...dadosMeta' captura todo o resto (nome, valorDaMeta, etc.) para a atualização.
    const { operacao, valor, ...dadosMeta } = req.body;

    try {

        if (operacao) {

            const valorNumerico = parseFloat(valor);
            if (isNaN(valorNumerico) || valorNumerico <= 0) {
                return res.status(400).json({ err: 'O valor para a operação deve ser um número positivo.' });
            }

            if (operacao === 'investir') {
                const metaAtualizada = await investirNaMeta(metaId, valorNumerico, usuarioId);
                return res.status(200).json({ metaAtualizada });
            }

            else if (operacao === 'retirar') {
                const metaAtualizada = await retirarDaMeta(metaId, valorNumerico, usuarioId);
                return res.status(200).json({ metaAtualizada });
            }

            else {
                return res.status(400).json({ err: `Operação desconhecida: ${operacao}` });
            }
        }

        // ATUALIZAR os dados da meta.
        else {
            const valorDaMeta = dadosMeta.valorDaMeta

            if (!dadosMeta.nome || valorDaMeta === undefined) {
                return res.status(400).json({ err: 'Nome e valor limite são obrigatórios para atualizar a meta.' });
            }

            dadosMeta.valorDaMeta = parseFloat(valorDaMeta)
            delete dadosMeta.valorDaMeta // limpa o antigo se existir

            await atualizarMetas(metaId, dadosMeta, usuarioId);
            return res.status(200).json({ message: 'Meta atualizada com sucesso!' });
        }

    } catch (err) {

        console.error(`Erro ao gerenciar meta [ID: ${metaId}]: `, err);
        res.status(500).json({ err: err.message || 'Ocorreu um erro inesperado no servidor.' });
    }
};

const excluirMetasController = async (req, res) => {
    try {
        const metaId = req.params.id
        await excluirMetas(metaId)
        res.status(200).json({ message: 'Meta excluida com sucesso!', metaId })
    } catch (err) {
        console.error('Erro ao excluir meta', err)
        res.status(500).json({ message: 'Erro ao excluir meta', err })
    }
}

// const investirNaMetaController = async (req, res) => {
//     try {
//         const metaId = req.params.id
//         const valor = req.body

//         if (!valor || isNaN(valor)) {
//             return res.status(400).json({ err: 'Valor inválido' })
//         }

//         await investirNaMeta(metaId, valor, req.usuarioId)
//         res.status(200).json({ message: 'Investimento bem-sucedido' })
//     } catch (err) {
//         console.error('Erro: ', err)
//         res.status(500).json({ err: err.message || 'Erro no investimento' })
//     }
// }

// const retirarNaMetaController = async (req, res) => {
//     try {
//         const metaId = req.params.id
//         const valor = req.body

//         if (!valor || isNaN(valor)) {
//             return res.status(400).json({ err: 'Valor inválido' })
//         }

//         await retirarDaMeta(metaId, valor, req.usuarioId)
//         res.status(200).json({ message: 'Retirada bem-sucedida' })
//     } catch (err) {
//         console.error('Erro: ', err)
//         res.status(500).json({ err: err.message || 'Erro no retirada' })
//     }
// }

export { metaController, adicionarMetasController, atualizarMetaController, excluirMetasController }