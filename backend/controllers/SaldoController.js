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

export { saldoController }