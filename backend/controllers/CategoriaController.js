import { readAll } from '../config/database.js'
import { adicionarCategoria, atualizarCategoria, excluirCategoria } from '../models/Categoria.js'

const categoriaController = async (req, res) => {
    try {
        const categoria = await readAll('view_categorias_por_usuario', `usuario_id = ${req.usuarioId}`)

        if (!categoria) {
            return res.status(404).json({ message: 'Categorias não encontradas para este usuário' })
        }

        res.status(200).json(categoria)
        
    } catch (err) {
        console.error('Erro no controller ao buscar categorias do usuário.', err)
        res.status(500).json({ err: 'Erro ao buscar categoria de usuário.' })
    }
}

export { categoriaController }