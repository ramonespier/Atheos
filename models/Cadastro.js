import { create } from "../config/database.js";

const cadastrarUsuario = async (usuarioData) => {
    try {
        return await create('usuarios', usuarioData)
    } catch (err) {
        console.error('Erro ao criar usuario', err)
        throw err;
    }
}

export { cadastrarUsuario }