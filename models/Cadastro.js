import { create } from "../config/database.js";

const cadastrarUsuario = async (usuarioData) => {
    try {
        return await create('usuarios', usuarioData)
    } catch (err) {
        console.error('Erro ao criar usuario', err)
        throw err;
    }
}

// const efetuarLogin = async (id) => {
//     try {
//         return await read('usuarios', `id=${id}`)
//     } catch (err) {
//         console.error('Erro ao realizar login;', err)
//         throw err;
//     }
// }

export { cadastrarUsuario }