// import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from '../config/jwt.js';

/*

import { read } from '../config/database.js';

const loginController = async (req, res) => {

    const { email, senha } = req.body;
    try {
        const usuario = await read('usuarios', `email = '${email}'`);
        if (!usuario) {
          return res.status(404).json({message: 'Usuário não encontrado'});
        }
        const senhaCorreta = await read('usuarios', `senha = ${senha}`);

        if(!senhaCorreta){
            return res.status(401).json({message: 'Senha incorreta'})
        }

        // const token = jwt.sign({id:usuario.id, tipo: usuario.tipo}, JWT_SECRET, { expiresIn: '1h'})

        res.status(200).json({message: 'Login efetuado com sucesso.' })

    } catch (err){
        console.error('Erro ao fazer login: ', err)
        res.status(500).json({message: 'Erro ao fazer login'})
    }

};

export { loginController }

*/

import jwt from 'jsonwebtoken';
import { read, compare } from '../config/database.js';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta

const loginController = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await read('usuarios', `email = '${email}'`);

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        const senhaCorreta = await compare(senha, usuario.senha);
        if (!senhaCorreta) {

            return res.status(401).json({ mensagem: 'Senha incorreta' });
        }

        const token = jwt.sign({ email: usuario.email, senha: usuario.senha }, JWT_SECRET, {
            expiresIn: '1h',
        });

    res.json({ mensagem: 'Login realizado com sucesso', token });
} catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
}
};

export { loginController };