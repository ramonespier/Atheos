import { atualizarUsuarios } from "../models/Config.js";
import { read } from "../config/database.js"; // Supondo que exista readOne para buscar 1 registro

const configController = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const config = await read ('usuarios', `id = ${usuarioId}`);

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
        const usuarioId = req.usuarioId;
        const { nome, email } = req.body;
        const usuarioData = { 
            nome: nome, 
            email: email 
        }

        await atualizarUsuarios(usuarioId, usuarioData);
        res.status(200).json({ message: 'Nome e email atualizados com sucesso!', usuarioId });
    } catch (err) {
        console.error('Erro ao atualizar o nome e email:', err);
        res.status(500).json({ message: 'Erro ao atualizar o nome e email.', err });
    }
};

export { atualizarUsuariosController, configController };
