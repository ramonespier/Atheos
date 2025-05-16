import { create } from "../config/database.js";
import bcrypt from 'bcryptjs';

const cadastrarUsuario = async (usuarioData) => {
    try {
        // Gera o hash da senha
        const salt = await bcrypt.genSalt(10); // 10 é o custo do salt
        const senhaHasheada = await bcrypt.hash(usuarioData.senha, salt);

        // Substitui a senha original pelo hash
        const usuarioComHash = {
            ...usuarioData,
            senha: senhaHasheada
        };

        return await create('usuarios', usuarioComHash);
    } catch (err) {
        console.error('Erro ao criar usuario', err);
        throw err;
    }
};

export { cadastrarUsuario };