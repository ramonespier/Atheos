import { update } from "../config/database.js";
import bcrypt from "bcryptjs";

const atualizarUsuarios = async (id, configData) => {
    try {
        const dadosComHash = {...configData}

        if (configData.senha) {
            const salt = await bcrypt.genSalt(10); // 10 é o custo do salt
            const senhaHasheada = await bcrypt.hash(configData.senha, salt);
            dadosComHash.senha = senhaHasheada
        }

        return await update('usuarios', dadosComHash, `id = ${id}`);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        throw err;
    }
};

export { atualizarUsuarios };
