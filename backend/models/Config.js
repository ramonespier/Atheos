import { update } from "../config/database.js";

const atualizarUsuarios = async (id, configData) => {
    try {
        return await update('usuarios', configData, `id = ${id}`);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        throw err;
    }
};

export { atualizarUsuarios };
