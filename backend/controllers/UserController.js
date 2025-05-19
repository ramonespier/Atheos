import { read } from "../config/database.js";

const getUsuarioLogado = async (req, res) => {
    try {
        const usuario = await read('usuarios', `id = ${req.usuarioId}`)

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario não encontrado.' })
        }

        const { senha, ...usuarioSemSenha } = usuario;
        res.json(usuarioSemSenha)
    } catch (err) {
        console.error({ message: 'Erro ao buscar usuário' })
    }
}

export { getUsuarioLogado }