import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({
            mensagem: 'Não autorizado: Token não fornecido'
        });
    }

    const [, token] = authHeader.split(' ');

    try {

        console.log('Token recebido:', token);
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token decodificado:', decoded);
        
        req.usuarioId = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Não autorizado: Token expirado' });
        }
        res.status(403).json({ message: 'Não autorizado: Token inválido' });
    }
};

export default authMiddleware;