import { atualizarUsuarios } from "../models/Config.js";
import { read } from "../config/database.js"; // Supondo que exista readOne para buscar 1 registro
import bcrypt, { compare } from "bcryptjs";

const configController = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const config = await read('usuarios', `id = ${usuarioId}`);

        if (!config) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json(config);
    } catch (err) {
        console.error('Erro no controller ao buscar nome e email do usuário.', err);
        res.status(500).json({ err: 'Erro ao buscar nome e email do usuário.' });
    }
};

const atualizarUsuariosController = async (req, res) => {
    try {

        const usuarioId = req.params.id;
        const { nome, email, senha_atual, senha: nova_senha } = req.body;

        if (!senha_atual) {
            return res.status(400).json({ message: 'A senha atual é obrigatória para qualquer alteração' })
        }

        const usuarioAtual = await read('usuarios', `id = ${usuarioId}`)

        if (!usuarioAtual) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const senhaValida = await bcrypt.compare(senha_atual, usuarioAtual.senha)
        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha atual incorreta.' })
        }

        const configData = {
            nome: nome || usuarioAtual.nome,
            email: email || usuarioAtual.email,
        }

        if (nova_senha) {
            configData.senha = nova_senha;
        }

        await atualizarUsuarios(usuarioId, configData);

        res.status(200).json({ message: 'Dados atualizados com sucesso!', usuarioId });

    } catch (err) {
        console.error('Erro ao atualizar o nome e email:', err);
        res.status(500).json({ message: 'Erro ao atualizar o nome e email.', err });
    }
};

export { atualizarUsuariosController, configController };
