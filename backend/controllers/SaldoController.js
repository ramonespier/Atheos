import { readAll } from '../config/database.js'
// import { adicionarCategoria, atualizarCategoria, excluirCategoria } from '../models/Categoria.js'

const saldoController = async (req, res) => {
    try {
        const saldo = await readAll('view_totais_por_usuario', `usuario_id = ${req.usuarioId}`)

        if (!saldo) {
            return res.status(404).json({ message: 'Saldo não encontrado para este usuário' })
        }

        res.status(200).json(saldo)

    } catch (err) {
        console.error('Erro no controller ao buscar saldos do usuário.', err)
        res.status(500).json({ err: 'Erro ao buscar saldo de usuário.' })
    }
}

// const adicionarCategoriaController = async (req, res) => {
//     try {
//         const { nome, tipo } = req.body;

//         const categoriasData = {
//             nome: nome,
//             tipo: tipo,
//             usuario_id: req.usuarioId
//         };

//         const categoriaId = await adicionarCategoria(categoriasData);
//         res.status(201).json({ message: 'Categoria criada com sucesso!', categoriaId })
//     } catch (err) {
//         console.error('Erro ao criar categoria', err)
//         res.status(500).json({ message: 'Erro ao criar categoria', err })
//     }
// }

// const atualizarCategoriaController = async (req, res) => {
//     try {
//         const categoriaId = req.params.id;
//         const { nome, tipo } = req.body;
//         const categoriaData = {
//             nome: nome,
//             tipo: tipo
//         };
//         await atualizarCategoria(categoriaId, categoriaData);
//         res.status(200).json({ message: 'Categoria atualizada com sucesso!', categoriaId })

//     } catch (err) {
//         console.error('Erro ao atualizar a categoria', err)
//         res.status(500).json({ message: 'Erro ao atualizar a categoria: ', err })
//     }

// }

// const excluirCategoriaController = async(req, res) => {
//     try {
//         const categoriaId = req.params.id;
//         await excluirCategoria (categoriaId)
//         res.status(200).json({message: 'Categoria excluida com sucesso!', categoriaId})
//     } catch (err) {
//         console.error('Erro ao excluir categoria', err)
//         res.status(500).json({message: 'Erro ao excluir categoria', err})
//     }
// }

export { saldoController }