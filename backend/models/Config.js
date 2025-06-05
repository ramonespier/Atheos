import { update } from "../config/database.js";
import bcrypt from "bcryptjs";

const atualizarUsuarios = async (id, configData) => {
    try {
        const salt = await bcrypt.genSalt(10); // 10 é o custo do salt
        const senhaHasheada = await bcrypt.hash(configData.senha, salt);

        // Substitui a senha original pelo hash
        const usuarioComHash = {
            ...configData,
            senha: senhaHasheada
        };

        return await update('usuarios', usuarioComHash, `id = ${id}`);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        throw err;
    }
};

export { atualizarUsuarios };
