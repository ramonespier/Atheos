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

// const efetuarLoginController = async (req, res) => {
//     try {
//         const login = req.params.id

//         if (login) {
//             res.status(200).json({ message: 'Login realizado' }, login)
//         } else {
//             res.status(404).json({ err: 'Perfil não cadastrado' })
//         }
//     } catch (err) {
//         console.error('Erro no controller ao efetuar login', err)
//         res.status(500).json({ err: 'Erro ao efetuar login.' })
//     }
// }

export { cadastrarUsuarioController }