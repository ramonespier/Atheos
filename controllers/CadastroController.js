import { cadastrarUsuario } from "../models/Cadastro.js";

const cadastrarUsuarioController = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const usuarioData = {
            nome: nome,
            email: email,
            senha: senha
        }

        const novoUsuario = await cadastrarUsuario(usuarioData);
        res.status(201).json(novoUsuario)
    } catch (err) {
        console.error('Erro no controller ao cadastrar usuário', err)
        res.status(500).json({ err: 'Erro ao cadastrar usuário.' })
    }
}

export { cadastrarUsuarioController }